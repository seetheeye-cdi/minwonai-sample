import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma, TicketStatus, TicketPriority, TicketUpdateType } from "@myapp/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cuid2 } from "@myapp/utils";

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
      
      const ticket = await prisma.ticket.create({
        data: {
          id: ticketId,
          organizationId: ctx.organizationId,
          ...input,
          status: "NEW",
          priority: "NORMAL",
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

      return ticket;
    }),

  // Get tickets for organization with filters
  list: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(TicketStatus).optional(),
        priority: z.nativeEnum(TicketPriority).optional(),
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
        ...(input.assignedToId && { assignedToId: input.assignedToId }),
      };

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          include: {
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

      // TODO: Send actual notification via Kakao/SMS/Email

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

  // Submit satisfaction survey
  submitSurvey: publicProcedure
    .input(
      z.object({
        ticketToken: z.string().uuid(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
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

      if (ticket.survey) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Survey already submitted",
        });
      }

      const survey = await prisma.satisfactionSurvey.create({
        data: {
          id: `srv_${cuid2()}`,
          ticketId: ticket.id,
          rating: input.rating,
          feedback: input.feedback,
          submittedAt: new Date(),
        },
      });

      return survey;
    }),
});
