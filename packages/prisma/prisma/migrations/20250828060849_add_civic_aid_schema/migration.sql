-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('NEW', 'CLASSIFIED', 'IN_PROGRESS', 'REPLIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."TicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."TicketUpdateType" AS ENUM ('STATUS_CHANGE', 'COMMENT', 'REPLY_SENT', 'ASSIGNMENT_CHANGE', 'PRIORITY_CHANGE', 'CATEGORY_CHANGE');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "citizenName" TEXT NOT NULL,
    "citizenPhone" TEXT,
    "citizenEmail" TEXT,
    "citizenAddress" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "sentiment" TEXT,
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'NEW',
    "priority" "public"."TicketPriority" NOT NULL DEFAULT 'NORMAL',
    "assignedToId" TEXT,
    "publicToken" TEXT NOT NULL,
    "slaDueAt" TIMESTAMP(3),
    "repliedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "aiSuggestedCategory" TEXT,
    "aiSuggestedResponse" TEXT,
    "aiSuggestedAssigneeId" TEXT,
    "aiConfidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketUpdate" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "updateType" "public"."TicketUpdateType" NOT NULL,
    "content" JSONB NOT NULL,
    "replyText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SatisfactionSurvey" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SatisfactionSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_clerkOrgId_key" ON "public"."Organization"("clerkOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "public"."Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_publicToken_key" ON "public"."Ticket"("publicToken");

-- CreateIndex
CREATE INDEX "Ticket_organizationId_status_idx" ON "public"."Ticket"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Ticket_assignedToId_status_idx" ON "public"."Ticket"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "Ticket_publicToken_idx" ON "public"."Ticket"("publicToken");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "public"."Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "Ticket_priority_status_idx" ON "public"."Ticket"("priority", "status");

-- CreateIndex
CREATE INDEX "TicketUpdate_ticketId_createdAt_idx" ON "public"."TicketUpdate"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "TicketUpdate_updateType_idx" ON "public"."TicketUpdate"("updateType");

-- CreateIndex
CREATE UNIQUE INDEX "SatisfactionSurvey_ticketId_key" ON "public"."SatisfactionSurvey"("ticketId");

-- CreateIndex
CREATE INDEX "SatisfactionSurvey_rating_idx" ON "public"."SatisfactionSurvey"("rating");

-- CreateIndex
CREATE INDEX "SatisfactionSurvey_submittedAt_idx" ON "public"."SatisfactionSurvey"("submittedAt");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketUpdate" ADD CONSTRAINT "TicketUpdate_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketUpdate" ADD CONSTRAINT "TicketUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SatisfactionSurvey" ADD CONSTRAINT "SatisfactionSurvey_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
