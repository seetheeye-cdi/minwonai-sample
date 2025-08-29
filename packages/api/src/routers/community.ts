import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma, TicketStatus, TicketPriority } from "@myapp/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cuid2 } from "@myapp/utils";
import { createHash } from "crypto";
import { createClassifier } from "@myapp/ai";
import { NotificationService } from "@myapp/notification";

// Helper function to hash IP address
function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

// Helper function to mask personal information
function maskPersonalInfo(text: string, type: "name" | "phone" | "content"): string {
  switch (type) {
    case "name":
      if (text.length <= 1) return text;
      const firstChar = text[0];
      const lastChar = text[text.length - 1];
      return `${firstChar}${"*".repeat(text.length - 2)}${lastChar}`;
    case "phone":
      // Mask phone number: 010-1234-5678 -> 010-12**-****
      return text.replace(/(\d{3})-?(\d{2})\d{2}-?\d{4}/, "$1-$2**-****");
    case "content":
      // Return first 160 characters only
      return text.length > 160 ? text.substring(0, 160) + "..." : text;
    default:
      return text;
  }
}

// Simple in-memory rate limiter (should use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: Date }>();

function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === "development" || process.env.SKIP_AUTH === "true") {
    return true;
  }
  
  const now = new Date();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: new Date(now.getTime() + windowMs),
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export const communityRouter = createTRPCRouter({
  // Create a public ticket from community page
  createPublicTicket: publicProcedure
    .input(
      z.object({
        citizenName: z.string().min(1).max(50),
        citizenPhone: z.string().min(10).max(20),
        citizenEmail: z.string().email().optional(),
        content: z.string().min(10).max(4000),
        category: z.string().min(1).max(50),
        nickname: z.string().max(30).optional(),
        isPublic: z.boolean().default(true),
        agreedToTerms: z.boolean().refine(val => val === true, {
          message: "개인정보 처리 동의가 필요합니다",
        }),
        organizationId: z.string(), // Which organization to submit to
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get client IP for rate limiting
      const clientIP = ctx.headers?.["x-forwarded-for"] || 
                       ctx.headers?.["x-real-ip"] || 
                       "unknown";
      const ipHash = hashIP(clientIP);

      // Check rate limit
      if (!checkRateLimit(`ticket:${ipHash}`, 3, 600000)) { // 3 tickets per 10 minutes
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
        });
      }

      const ticketId = `tkt_${cuid2()}`;
      const publicToken = cuid2();

      // Create masked excerpt for public display
      const publicExcerpt = maskPersonalInfo(input.content, "content");

      // Ensure organization exists (create default if not)
      let org = await prisma.organization.findUnique({
        where: { id: input.organizationId },
      });
      
      if (!org) {
        // Create default organization if it doesn't exist
        try {
          org = await prisma.organization.create({
            data: {
              id: input.organizationId,
              clerkOrgId: input.organizationId, // Use same ID for simplicity
              name: "Community Organization",
              slug: "community",
              description: "Default organization for community submissions",
            },
          });
        } catch (error) {
          // Organization might have been created by another request
          org = await prisma.organization.findUnique({
            where: { id: input.organizationId },
          });
          if (!org) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create organization",
            });
          }
        }
      }
      
      // Create the ticket
      const ticket = await prisma.ticket.create({
        data: {
          id: ticketId,
          organizationId: input.organizationId,
          citizenName: input.citizenName,
          citizenPhone: input.citizenPhone,
          citizenEmail: input.citizenEmail,
          content: input.content,
          category: input.category,
          status: "NEW",
          priority: "NORMAL",
          publicToken,
          isPublic: input.isPublic,
          publicExcerpt,
          source: "community",
          nickname: input.nickname || "익명",
        },
      });

      // Create initial status update
      await prisma.ticketUpdate.create({
        data: {
          ticketId: ticket.id,
          updateType: "STATUS_CHANGE",
          content: { from: null, to: "NEW", source: "community" },
        },
      });

      // Trigger AI classification (async)
      try {
        const classifier = createClassifier();
        const analysis = await classifier.classifyTicket({
          content: input.content,
          category: input.category,
        });

        await prisma.ticket.update({
          where: { id: ticketId },
          data: {
            sentiment: analysis.sentiment,
            priority: analysis.priority === "URGENT" ? "HIGH" : analysis.priority,
            aiSummary: analysis.summary,
            aiConfidenceScore: analysis.confidence,
          },
        });
      } catch (error) {
        console.error("AI classification failed:", error);
      }

      // Send notification to citizen
      try {
        const notificationService = new NotificationService();
        await notificationService.sendTicketReceivedNotification({
          ticketId,
          recipientName: input.citizenName,
          recipientPhone: input.citizenPhone,
          recipientEmail: input.citizenEmail,
          publicToken,
        });
      } catch (error) {
        console.error("Notification failed:", error);
      }

      return {
        publicToken,
        message: "민원이 성공적으로 접수되었습니다.",
      };
    }),

  // Get public tickets list
  getPublicTickets: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = {
        isPublic: true,
        source: "community",
        ...(input.category && { category: input.category }),
      };

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          select: {
            id: true,
            publicToken: true,
            nickname: true,
            category: true,
            status: true,
            publicExcerpt: true,
            createdAt: true,
            _count: {
              select: {
                likes: true,
                comments: {
                  where: { isHidden: false },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.ticket.count({ where }),
      ]);

      return {
        tickets: tickets.map(ticket => ({
          ...ticket,
          statusLabel: getStatusLabel(ticket.status),
        })),
        total,
        hasMore: input.offset + tickets.length < total,
      };
    }),

  // Add like to a ticket
  addLike: publicProcedure
    .input(
      z.object({
        publicToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clientIP = ctx.headers?.["x-forwarded-for"] || 
                       ctx.headers?.["x-real-ip"] || 
                       "unknown";
      const ipHash = hashIP(clientIP);
      const userAgent = ctx.headers?.["user-agent"] || undefined;

      // Check rate limit
      if (!checkRateLimit(`like:${ipHash}`, 10, 60000)) { // 10 likes per minute
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "너무 많은 요청입니다.",
        });
      }

      // Find ticket
      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.publicToken },
        select: { id: true },
      });

      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "티켓을 찾을 수 없습니다.",
        });
      }

      // Try to create like (will fail if duplicate due to unique constraint)
      try {
        await prisma.communityLike.create({
          data: {
            ticketId: ticket.id,
            ipHash,
            userAgent,
          },
        });

        return { success: true };
      } catch (error: any) {
        if (error.code === "P2002") {
          // Unique constraint violation - user already liked
          throw new TRPCError({
            code: "CONFLICT",
            message: "이미 좋아요를 누르셨습니다.",
          });
        }
        throw error;
      }
    }),

  // Add comment to a ticket
  addComment: publicProcedure
    .input(
      z.object({
        publicToken: z.string(),
        nickname: z.string().max(30).default("익명"),
        content: z.string().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clientIP = ctx.headers?.["x-forwarded-for"] || 
                       ctx.headers?.["x-real-ip"] || 
                       "unknown";
      const ipHash = hashIP(clientIP);

      // Check rate limit
      if (!checkRateLimit(`comment:${ipHash}`, 5, 300000)) { // 5 comments per 5 minutes
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "너무 많은 댓글을 작성하셨습니다. 잠시 후 다시 시도해주세요.",
        });
      }

      // Find ticket
      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.publicToken },
        select: { id: true, isPublic: true },
      });

      if (!ticket || !ticket.isPublic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "티켓을 찾을 수 없습니다.",
        });
      }

      // Simple profanity check (extend this list as needed)
      const bannedWords = ["욕설1", "욕설2", "광고", "spam"];
      const containsBannedWord = bannedWords.some(word => 
        input.content.toLowerCase().includes(word)
      );

      if (containsBannedWord) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "부적절한 내용이 포함되어 있습니다.",
        });
      }

      // Create comment
      const comment = await prisma.communityComment.create({
        data: {
          ticketId: ticket.id,
          nickname: input.nickname,
          content: input.content,
          ipHash,
        },
        select: {
          id: true,
          nickname: true,
          content: true,
          createdAt: true,
        },
      });

      return comment;
    }),

  // Get comments for a ticket
  getComments: publicProcedure
    .input(
      z.object({
        publicToken: z.string(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { publicToken: input.publicToken },
        select: { id: true, isPublic: true },
      });

      if (!ticket || !ticket.isPublic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "티켓을 찾을 수 없습니다.",
        });
      }

      const [comments, total] = await Promise.all([
        prisma.communityComment.findMany({
          where: {
            ticketId: ticket.id,
            isHidden: false,
          },
          select: {
            id: true,
            nickname: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.communityComment.count({
          where: {
            ticketId: ticket.id,
            isHidden: false,
          },
        }),
      ]);

      return {
        comments,
        total,
        hasMore: input.offset + comments.length < total,
      };
    }),

  // Get ticket categories for filter
  getCategories: publicProcedure.query(async () => {
    const categories = await prisma.ticket.findMany({
      where: {
        isPublic: true,
        source: "community",
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return categories
      .map(c => c.category)
      .filter((c): c is string => c !== null)
      .sort();
  }),
});

// Helper function to get Korean status label
function getStatusLabel(status: TicketStatus): string {
  const statusMap: Record<TicketStatus, string> = {
    NEW: "접수 완료",
    CLASSIFIED: "분류 완료",
    IN_PROGRESS: "처리 중",
    REPLIED: "답변 완료",
    CLOSED: "종료",
  };
  return statusMap[status] || status;
}
