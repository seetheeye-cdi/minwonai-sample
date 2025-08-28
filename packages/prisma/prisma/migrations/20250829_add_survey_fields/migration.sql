-- AlterTable: Add new fields to SatisfactionSurvey
ALTER TABLE "public"."SatisfactionSurvey" 
ADD COLUMN IF NOT EXISTS "responderFingerprint" TEXT,
ADD COLUMN IF NOT EXISTS "channelSentAt" TIMESTAMP(3);

-- CreateIndex for channelSentAt
CREATE INDEX IF NOT EXISTS "SatisfactionSurvey_channelSentAt_idx" ON "public"."SatisfactionSurvey"("channelSentAt");

-- Add check constraint for rating range (1-5)
ALTER TABLE "public"."SatisfactionSurvey" 
DROP CONSTRAINT IF EXISTS "SatisfactionSurvey_rating_check",
ADD CONSTRAINT "SatisfactionSurvey_rating_check" CHECK (rating >= 1 AND rating <= 5);

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "public"."NotificationType" AS ENUM ('RECEIPT_CONFIRMATION', 'STATUS_UPDATE', 'REPLY_SENT', 'SATISFACTION_REQUEST');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."NotificationChannel" AS ENUM ('SMS', 'EMAIL', 'KAKAO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."NotificationQueue" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "ticketId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "channel" "public"."NotificationChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "NotificationQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NotificationQueue_status_scheduledFor_idx" ON "public"."NotificationQueue"("status", "scheduledFor");
CREATE INDEX IF NOT EXISTS "NotificationQueue_ticketId_idx" ON "public"."NotificationQueue"("ticketId");

-- CreateUniqueIndex  
CREATE UNIQUE INDEX IF NOT EXISTS "NotificationQueue_ticketId_type_key" ON "public"."NotificationQueue"("ticketId", "type");
