import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@myapp/prisma";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cuid2 } from "@myapp/utils";

export const organizationRouter = createTRPCRouter({
  // Get current user's organization
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.organizationId) {
      return null;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: ctx.organizationId },
      include: {
        _count: {
          select: {
            users: true,
            tickets: true,
          },
        },
      },
    });

    return organization;
  }),

  // Create or sync organization from Clerk
  syncFromClerk: protectedProcedure
    .input(
      z.object({
        clerkOrgId: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if organization already exists
      const existing = await prisma.organization.findUnique({
        where: { clerkOrgId: input.clerkOrgId },
      });

      if (existing) {
        // Update existing organization
        const updated = await prisma.organization.update({
          where: { id: existing.id },
          data: {
            name: input.name,
            slug: input.slug,
            description: input.description,
          },
        });

        // Update user's organization if not set
        if (!ctx.user.organizationId) {
          await prisma.user.update({
            where: { id: ctx.user.id },
            data: { organizationId: updated.id },
          });
        }

        return updated;
      }

      // Create new organization
      const organization = await prisma.organization.create({
        data: {
          id: `org_${cuid2()}`,
          clerkOrgId: input.clerkOrgId,
          name: input.name,
          slug: input.slug,
          description: input.description,
        },
      });

      // Update user's organization
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { 
          organizationId: organization.id,
          role: "ADMIN", // First user becomes admin
        },
      });

      return organization;
    }),

  // Get organization members
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.organizationId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Organization required",
      });
    }

    const members = await prisma.user.findMany({
      where: { organizationId: ctx.organizationId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return members;
  }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organization required",
        });
      }

      // Check if current user is admin
      if (ctx.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can change roles",
        });
      }

      // Prevent self-demotion if last admin
      if (input.userId === ctx.user.id && input.role !== "ADMIN") {
        const adminCount = await prisma.user.count({
          where: {
            organizationId: ctx.organizationId,
            role: "ADMIN",
          },
        });

        if (adminCount === 1) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot remove last admin",
          });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });

      return updatedUser;
    }),

  // Get organization statistics
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.organizationId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Organization required",
      });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    const [
      totalTickets,
      todayTickets,
      weekTickets,
      openTickets,
      repliedTickets,
      avgResponseTime,
      satisfactionStats,
    ] = await Promise.all([
      // Total tickets
      prisma.ticket.count({
        where: { organizationId: ctx.organizationId },
      }),
      
      // Today's tickets
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: todayStart },
        },
      }),
      
      // This week's tickets
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          createdAt: { gte: weekStart },
        },
      }),
      
      // Open tickets (NEW, CLASSIFIED, IN_PROGRESS)
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: { in: ["NEW", "CLASSIFIED", "IN_PROGRESS"] },
        },
      }),
      
      // Replied tickets
      prisma.ticket.count({
        where: {
          organizationId: ctx.organizationId,
          status: "REPLIED",
        },
      }),
      
      // Average response time (in hours)
      prisma.ticket.aggregate({
        where: {
          organizationId: ctx.organizationId,
          repliedAt: { not: null },
        },
        _avg: {
          // This will be calculated in the query result
          id: true, // Placeholder, we'll calculate manually
        },
      }),
      
      // Satisfaction statistics
      prisma.satisfactionSurvey.aggregate({
        where: {
          ticket: { organizationId: ctx.organizationId },
          submittedAt: { not: null },
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    // Calculate average response time manually
    const ticketsWithResponseTime = await prisma.ticket.findMany({
      where: {
        organizationId: ctx.organizationId,
        repliedAt: { not: null },
      },
      select: {
        createdAt: true,
        repliedAt: true,
      },
    });

    const avgResponseHours = ticketsWithResponseTime.length > 0
      ? ticketsWithResponseTime.reduce((acc, ticket) => {
          const diff = ticket.repliedAt!.getTime() - ticket.createdAt.getTime();
          return acc + diff / (1000 * 60 * 60); // Convert to hours
        }, 0) / ticketsWithResponseTime.length
      : 0;

    return {
      totalTickets,
      todayTickets,
      weekTickets,
      openTickets,
      repliedTickets,
      avgResponseTime: Math.round(avgResponseHours * 10) / 10, // Round to 1 decimal
      satisfactionScore: satisfactionStats._avg.rating || 0,
      satisfactionCount: satisfactionStats._count.rating,
    };
  }),
});
