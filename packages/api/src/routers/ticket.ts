import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma, TicketStatus, TicketPriority, Sentiment } from "@myapp/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cuid2 } from "@myapp/utils";
import { createClassifier } from "@myapp/ai";
import { NotificationService } from "@myapp/notification";

export const ticketRouter = createTRPCRouter({
  // Create a new ticket
  create: protectedProcedure
    .input(
      z.object({
        citizenName: z.string().min(1),
        citizenPhone: z.string().optional(),
        citizenEmail: z.string().email().optional(),
        citizenAddress: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const ticketId = `tkt_${cuid2()}`;
      const publicToken = cuid2();
      
      const ticket = await prisma.ticket.create({
        data: {
          id: ticketId,
          organizationId: ctx.organizationId,
          ...input,
          status: "NEW",
          priority: "NORMAL",
          publicToken,
        },
      });

      // Create initial status update
      await prisma.ticketUpdate.create({
        data: {
          ticketId: ticket.id,
          userId: ctx.user.id,
          updateType: "STATUS_CHANGE",
          content: { from: null, to: "NEW" },
        },
      });

      // AI 분류 수행 (비동기, 실패해도 티켓 생성은 성공)
      performAIClassification(ticketId, {
        content: input.content,
        citizenName: input.citizenName,
        organizationId: ctx.organizationId,
      }).catch((error) => {
        console.error(`AI 분류 실패 (티켓 ${ticketId}):`, error);
        // AI 분류 실패 시 수동 검토 플래그 설정
        prisma.ticket.update({
          where: { id: ticketId },
          data: {
            aiNeedsManualReview: true,
            aiErrorMessage: error instanceof Error ? error.message : "AI 분류 실패",
          },
        }).catch(console.error);
      });

      // Queue notification for ticket received
      const notificationService = new NotificationService();
      await notificationService.queueNotification({
        ticketId: ticket.id,
        type: "TICKET_RECEIVED",
        recipientName: input.citizenName,
        recipientPhone: input.citizenPhone,
        recipientEmail: input.citizenEmail,
        templateData: {
          ticketId: ticket.id,
          createdAt: new Date().toLocaleString("ko-KR"),
          timelineUrl: `${process.env.NEXT_PUBLIC_APP_URL}/timeline/${publicToken}`,
        },
      }).catch((error) => {
        console.error(`알림 큐 생성 실패 (티켓 ${ticketId}):`, error);
      });

      return ticket;
    }),

  // Get tickets for organization with filters
  list: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(TicketStatus).optional(),
        priority: z.nativeEnum(TicketPriority).optional(),
        sentiment: z.nativeEnum(Sentiment).optional(),
        assignedToId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const where = {
        organizationId: ctx.organizationId,
        ...(input.status && { status: input.status }),
        ...(input.priority && { priority: input.priority }),
        ...(input.sentiment && { sentiment: input.sentiment }),
        ...(input.assignedToId && { assignedToId: input.assignedToId }),
      };

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          select: {
            id: true,
            citizenName: true,
            content: true,
            category: true,
            sentiment: true,
            status: true,
            priority: true,
            slaDueAt: true,
            createdAt: true,
            assignedTo: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            _count: {
              select: {
                updates: true,
              },
            },
          },
          orderBy: [
            { priority: "desc" },
            { createdAt: "desc" },
          ],
          take: input.limit,
          skip: input.offset,
        }),
        prisma.ticket.count({ where }),
      ]);

      return {
        tickets,
        total,
        hasMore: input.offset + tickets.length < total,
      };
    }),

  // Get single ticket by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.organizationId,
        },
        include: {
          assignedTo: true,
          updates: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          survey: true,
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      return ticket;
    }),

  // Update ticket status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(TicketStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.organizationId,
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const updatedTicket = await prisma.$transaction(async (tx) => {
        // Update ticket
        const updated = await tx.ticket.update({
          where: { id: input.id },
          data: {
            status: input.status,
            ...(input.status === "REPLIED" && { repliedAt: new Date() }),
            ...(input.status === "CLOSED" && { closedAt: new Date() }),
          },
        });

        // Create update log
        await tx.ticketUpdate.create({
          data: {
            ticketId: ticket.id,
            userId: ctx.user.id,
            updateType: "STATUS_CHANGE",
            content: { from: ticket.status, to: input.status },
          },
        });

        return updated;
      });

      return updatedTicket;
    }),

  // Assign ticket to agent
  assign: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        assignToId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      // Check if user has permission (must be admin or assigning to self)
      if (ctx.user.role !== "ADMIN" && input.assignToId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permission denied",
        });
      }

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.ticketId,
          organizationId: ctx.organizationId,
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const updatedTicket = await prisma.$transaction(async (tx) => {
        const updated = await tx.ticket.update({
          where: { id: input.ticketId },
          data: { assignedToId: input.assignToId },
        });

        await tx.ticketUpdate.create({
          data: {
            ticketId: ticket.id,
            userId: ctx.user.id,
            updateType: "ASSIGNMENT_CHANGE",
            content: {
              from: ticket.assignedToId,
              to: input.assignToId,
            },
          },
        });

        return updated;
      });

      return updatedTicket;
    }),

  // Send reply to citizen
  sendReply: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        replyText: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.ticketId,
          organizationId: ctx.organizationId,
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        // Update ticket status to REPLIED
        const updatedTicket = await tx.ticket.update({
          where: { id: input.ticketId },
          data: {
            status: "REPLIED",
            repliedAt: new Date(),
          },
        });

        // Create reply update
        await tx.ticketUpdate.create({
          data: {
            ticketId: ticket.id,
            userId: ctx.user.id,
            updateType: "REPLY_SENT",
            replyText: input.replyText,
            content: {
              replyText: input.replyText,
              sentAt: new Date().toISOString(),
            },
          },
        });

        return updatedTicket;
      });

      // Send notification for reply
      const notificationService = new NotificationService();
      await notificationService.queueNotification({
        ticketId: result.id,
        type: "TICKET_REPLIED",
        recipientName: result.citizenName,
        recipientPhone: result.citizenPhone || undefined,
        recipientEmail: result.citizenEmail || undefined,
        templateData: {
          ticketId: result.id,
          replyText: input.replyText,
          timelineUrl: `${process.env.NEXT_PUBLIC_APP_URL}/timeline/${result.publicToken}`,
        },
      }).catch((error) => {
        console.error(`알림 큐 생성 실패 (티켓 ${result.id}):`, error);
      });

      return result;
    }),

  // Public endpoint to get ticket by public token (for citizen timeline)
  getByPublicToken: publicProcedure
    .input(z.object({ token: z.string().uuid() }))
    .query(async ({ input }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.token },
        select: {
          id: true,
          citizenName: true,
          content: true,
          category: true,
          status: true,
          priority: true,
          createdAt: true,
          repliedAt: true,
          closedAt: true,
          updates: {
            select: {
              id: true,
              updateType: true,
              content: true,
              replyText: true,
              createdAt: true,
            },
            orderBy: { createdAt: "asc" },
          },
          survey: {
            select: {
              rating: true,
              feedback: true,
              submittedAt: true,
            },
          },
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      return ticket;
    }),

  // Generate AI draft reply
  generateAIDraft: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        tone: z.enum(["formal", "friendly", "empathetic", "direct"]).optional(),
        additionalPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.ticketId,
          organizationId: ctx.organizationId,
        },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      try {
        const classifier = createClassifier();
        
        // 톤 조정을 위한 추가 프롬프트 구성
        let tonePrompt = "";
        if (input.tone) {
          const toneMap = {
            formal: "공식적이고 정중한 어조로",
            friendly: "친근하고 따뜻한 어조로",
            empathetic: "공감하고 이해하는 어조로",
            direct: "간결하고 명확한 어조로",
          };
          tonePrompt = toneMap[input.tone];
        }

        // AI 답변 초안 생성
        const draft = await classifier.generateReplyDraftWithTone(
          ticket.content,
          ticket.category || "미분류",
          ticket.citizenName,
          tonePrompt
        );

        // 생성된 초안을 DB에 저장 (선택사항)
        await prisma.ticket.update({
          where: { id: input.ticketId },
          data: {
            aiDraftAnswer: draft,
          },
        });

        return { draft };
      } catch (error) {
        console.error("AI draft generation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate AI draft",
        });
      }
    }),

  // Check if survey is eligible for submission
  checkSurveyEligibility: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.token },
        include: { survey: true },
      });

      if (!ticket) {
        return { eligible: false, reason: "TICKET_NOT_FOUND" };
      }

      // Check if ticket is in a state that allows survey submission
      const eligibleStatuses: TicketStatus[] = ["REPLIED", "CLOSED"];
      if (!eligibleStatuses.includes(ticket.status)) {
        return { eligible: false, reason: "TICKET_NOT_COMPLETED" };
      }

      // Check if survey already submitted
      if (ticket.survey?.submittedAt) {
        return { eligible: false, reason: "SURVEY_ALREADY_SUBMITTED" };
      }

      return { 
        eligible: true, 
        ticketId: ticket.id,
        status: ticket.status,
        repliedAt: ticket.repliedAt,
      };
    }),

  // Submit satisfaction survey
  submitSatisfactionSurvey: publicProcedure
    .input(
      z.object({
        ticketToken: z.string(),
        rating: z.number().min(1).max(5),
        feedback: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get client IP for fingerprinting
      const clientIP = ctx.headers?.['x-forwarded-for'] || 
                       ctx.headers?.['x-real-ip'] || 
                       ctx.headers?.['cf-connecting-ip'] ||
                       'unknown';
      const userAgent = ctx.headers?.['user-agent'] || 'unknown';
      
      // Create fingerprint (hash of IP + user agent)
      const crypto = await import('crypto');
      const fingerprint = crypto
        .createHash('sha256')
        .update(`${clientIP}:${userAgent}`)
        .digest('hex');

      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.ticketToken },
        include: { survey: true },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found",
        });
      }

      // Check if survey already submitted
      if (ticket.survey?.submittedAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Survey already submitted",
        });
      }

      // Check if ticket is in a state that allows survey
      const eligibleStatuses: TicketStatus[] = ["REPLIED", "CLOSED"];
      if (!eligibleStatuses.includes(ticket.status)) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Cannot submit survey for this ticket status",
        });
      }

      // Create or update survey
      const survey = await prisma.satisfactionSurvey.upsert({
        where: { ticketId: ticket.id },
        create: {
          id: `srv_${cuid2()}`,
          ticketId: ticket.id,
          rating: input.rating,
          feedback: input.feedback,
          submittedAt: new Date(),
          responderFingerprint: fingerprint,
        },
        update: {
          rating: input.rating,
          feedback: input.feedback,
          submittedAt: new Date(),
          responderFingerprint: fingerprint,
        },
      });

      // Create ticket update for survey submission
      await prisma.ticketUpdate.create({
        data: {
          ticketId: ticket.id,
          updateType: "COMMENT",
          content: { 
            type: "SURVEY_SUBMITTED", 
            rating: input.rating,
            hasFeedback: Boolean(input.feedback),
          },
        },
      });

      return survey;
    }),
  
  // Legacy submitSurvey - kept for backward compatibility
  submitSurvey: publicProcedure
    .input(
      z.object({
        ticketToken: z.string(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Redirect to new method
      return ticketRouter.submitSatisfactionSurvey.mutation({
        ...ctx,
        input,
      });
    }),

  // Get satisfaction statistics
  getSatisfactionStats: protectedProcedure
    .input(
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const whereClause: any = {
        ticket: {
          organizationId: ctx.organizationId,
        },
        submittedAt: { not: null },
      };

      if (input.from || input.to) {
        whereClause.submittedAt = {
          ...(input.from ? { gte: new Date(input.from) } : {}),
          ...(input.to ? { lte: new Date(input.to) } : {}),
        };
      }

      if (input.category) {
        whereClause.ticket.category = input.category;
      }

      const [stats, distribution, recentSurveys] = await Promise.all([
        // Overall statistics
        prisma.satisfactionSurvey.aggregate({
          where: whereClause,
          _avg: { rating: true },
          _count: { rating: true },
          _max: { rating: true },
          _min: { rating: true },
        }),

        // Rating distribution
        prisma.satisfactionSurvey.groupBy({
          by: ['rating'],
          where: whereClause,
          _count: { rating: true },
          orderBy: { rating: 'asc' },
        }),

        // Recent surveys with feedback
        prisma.satisfactionSurvey.findMany({
          where: {
            ...whereClause,
            feedback: { not: null },
          },
          include: {
            ticket: {
              select: {
                id: true,
                category: true,
                citizenName: true,
                createdAt: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
          take: 10,
        }),
      ]);

      // Calculate response rate
      const totalTickets = await prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: { in: ["REPLIED", "CLOSED"] },
          ...(input.category ? { category: input.category } : {}),
        },
      });

      const responseRate = totalTickets > 0 
        ? (stats._count.rating / totalTickets) * 100 
        : 0;

      return {
        average: stats._avg.rating || 0,
        count: stats._count.rating,
        max: stats._max.rating || 0,
        min: stats._min.rating || 0,
        responseRate: Math.round(responseRate * 100) / 100,
        distribution: distribution.map(d => ({
          rating: d.rating,
          count: d._count.rating,
        })),
        recentFeedback: recentSurveys.map(s => ({
          id: s.id,
          rating: s.rating,
          feedback: s.feedback,
          submittedAt: s.submittedAt,
          ticket: s.ticket,
        })),
      };
    }),

  // Get dashboard statistics
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.organizationId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Organization required",
      });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayReceived,
      todayCompleted,
      todayDelayed,
      weekReceived,
      weekCompleted,
      weekDelayed,
      totalOpen,
      avgResponseTime,
      satisfactionStats,
    ] = await Promise.all([
      // 오늘 접수
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: todayStart },
        },
      }),
      
      // 오늘 완료
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: { in: ["REPLIED", "CLOSED"] },
          repliedAt: { gte: todayStart },
        },
      }),
      
      // 오늘 지연 (SLA 초과)
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          slaDueAt: { lt: now },
          status: { notIn: ["REPLIED", "CLOSED"] },
        },
      }),
      
      // 주간 접수
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: weekStart },
        },
      }),
      
      // 주간 완료
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: { in: ["REPLIED", "CLOSED"] },
          repliedAt: { gte: weekStart },
        },
      }),
      
      // 주간 지연
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: weekStart },
          slaDueAt: { lt: now },
          status: { notIn: ["REPLIED", "CLOSED"] },
        },
      }),
      
      // 전체 미처리
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: { in: ["NEW", "CLASSIFIED", "IN_PROGRESS"] },
        },
      }),
      
      // 평균 응답 시간 (분 단위)
      prisma.$queryRaw<{ avg_minutes: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM (replied_at - created_at)) / 60) as avg_minutes
        FROM "Ticket"
        WHERE organization_id = ${ctx.organizationId}
          AND replied_at IS NOT NULL
          AND created_at >= ${weekStart}
      `.then((result) => result[0]?.avg_minutes || 0),
      
      // 만족도 통계
      prisma.satisfactionSurvey.aggregate({
        where: {
          ticket: {
            organizationId: ctx.organizationId,
          },
          submittedAt: { gte: weekStart },
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      today: {
        received: todayReceived,
        completed: todayCompleted,
        delayed: todayDelayed,
      },
      week: {
        received: weekReceived,
        completed: weekCompleted,
        delayed: weekDelayed,
      },
      totalOpen,
      avgResponseTime: Math.round(avgResponseTime),
      satisfaction: {
        average: satisfactionStats._avg.rating || 0,
        count: satisfactionStats._count.rating,
      },
    };
  }),

  // Get SLA approaching tickets
  getSLATickets: protectedProcedure
    .input(
      z.object({
        hoursThreshold: z.number().min(1).max(48).default(24),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const thresholdDate = new Date();
      thresholdDate.setHours(thresholdDate.getHours() + input.hoursThreshold);

      const tickets = await prisma.ticket.findMany({
        where: {
          organizationId: ctx.organizationId,
          status: { notIn: ["REPLIED", "CLOSED"] },
          slaDueAt: {
            not: null,
            lte: thresholdDate,
          },
        },
        select: {
          id: true,
          citizenName: true,
          category: true,
          priority: true,
          status: true,
          createdAt: true,
          slaDueAt: true,
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: {
          slaDueAt: "asc",
        },
        take: input.limit,
      });

      return tickets.map((ticket) => ({
        ...ticket,
        remainingHours: ticket.slaDueAt
          ? Math.max(0, Math.floor((ticket.slaDueAt.getTime() - Date.now()) / (1000 * 60 * 60)))
          : null,
      }));
    }),

  // Get ticket trends for charts
  getTicketTrends: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(30).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      // 일별 접수/완료 통계
      const dailyStats = await prisma.$queryRaw<
        Array<{
          date: Date;
          received: bigint;
          completed: bigint;
        }>
      >`
        WITH date_series AS (
          SELECT generate_series(
            ${startDate}::date,
            CURRENT_DATE,
            '1 day'::interval
          )::date AS date
        )
        SELECT 
          ds.date,
          COALESCE(COUNT(DISTINCT t1.id), 0) AS received,
          COALESCE(COUNT(DISTINCT t2.id), 0) AS completed
        FROM date_series ds
        LEFT JOIN "Ticket" t1 ON DATE(t1.created_at) = ds.date 
          AND t1.organization_id = ${ctx.organizationId}
        LEFT JOIN "Ticket" t2 ON DATE(t2.replied_at) = ds.date 
          AND t2.organization_id = ${ctx.organizationId}
        GROUP BY ds.date
        ORDER BY ds.date
      `;

      // 카테고리별 분포
      const categoryStats = await prisma.ticket.groupBy({
        by: ["category"],
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: startDate },
        },
        _count: {
          id: true,
        },
      });

      return {
        daily: dailyStats.map((stat) => ({
          date: stat.date.toISOString().split("T")[0],
          received: Number(stat.received),
          completed: Number(stat.completed),
        })),
        categories: categoryStats.map((stat) => ({
          category: stat.category || "미분류",
          count: stat._count.id,
        })),
      };
    }),
});

// AI 분류 수행 함수 (비동기)
async function performAIClassification(
  ticketId: string, 
  request: { content: string; citizenName?: string; organizationId: string }
) {
  try {
    const classifier = createClassifier();
    const result = await classifier.classifyComplaint(request);

    // AI 분류 결과로 티켓 업데이트
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        category: result.category,
        sentiment: result.sentiment as Sentiment,
        priority: result.priority as TicketPriority,
        aiSummary: result.summary,
        status: "CLASSIFIED",
        // 담당자 배정 (추후 실제 사용자 매핑 로직 추가)
        // assignedToId: result.suggestedAssigneeId,
      },
    });

    // AI 답변 초안 생성 (신뢰도가 높은 경우만)
    if (result.confidence > 0.7) {
      const draftReply = await classifier.generateReplyDraft(
        request.content,
        result.category,
        request.citizenName
      );

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          aiDraftAnswer: draftReply,
        },
      });
    }

    // 분류 완료 로그 추가
    await prisma.ticketUpdate.create({
      data: {
        ticketId,
        userId: null, // 시스템 생성
        updateType: "STATUS_CHANGE",
        content: {
          message: `AI 분류 완료: ${result.category}`,
          confidence: Math.round(result.confidence * 100),
          category: result.category,
          sentiment: result.sentiment,
          priority: result.priority,
        },
      },
    });

  } catch (error) {
    console.error("AI 분류 실패:", error);
    throw error;
  }
}
