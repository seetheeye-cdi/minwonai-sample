-- Manual migration to add missing columns
-- Run this in Supabase SQL Editor if needed

-- Add responderFingerprint column to SatisfactionSurvey table
ALTER TABLE "SatisfactionSurvey" 
ADD COLUMN IF NOT EXISTS "responderFingerprint" TEXT;

-- Add other missing columns for Ticket table if needed
ALTER TABLE "Ticket"
ADD COLUMN IF NOT EXISTS "aiDraftAnswer" TEXT,
ADD COLUMN IF NOT EXISTS "aiErrorMessage" TEXT,
ADD COLUMN IF NOT EXISTS "aiNeedsManualReview" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "aiSummary" TEXT,
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "publicExcerpt" TEXT,
ADD COLUMN IF NOT EXISTS "source" VARCHAR(255) DEFAULT 'web';

-- Drop old columns if they exist
ALTER TABLE "Ticket"
DROP COLUMN IF EXISTS "aiSuggestedCategory",
DROP COLUMN IF EXISTS "aiSuggestedResponse";

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "Ticket_isPublic_createdAt_idx" ON "Ticket"("isPublic", "createdAt");
CREATE INDEX IF NOT EXISTS "Ticket_source_idx" ON "Ticket"("source");

-- Add CommunityLike table if not exists
CREATE TABLE IF NOT EXISTS "CommunityLike" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityLike_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint and indexes for CommunityLike
CREATE UNIQUE INDEX IF NOT EXISTS "CommunityLike_ticketId_ipHash_key" ON "CommunityLike"("ticketId", "ipHash");
CREATE INDEX IF NOT EXISTS "CommunityLike_ticketId_idx" ON "CommunityLike"("ticketId");
CREATE INDEX IF NOT EXISTS "CommunityLike_createdAt_idx" ON "CommunityLike"("createdAt");

-- Add foreign key constraint for CommunityLike
ALTER TABLE "CommunityLike" 
ADD CONSTRAINT "CommunityLike_ticketId_fkey" 
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add CommunityComment table if not exists
CREATE TABLE IF NOT EXISTS "CommunityComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "hiddenReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- Add indexes for CommunityComment
CREATE INDEX IF NOT EXISTS "CommunityComment_ticketId_createdAt_idx" ON "CommunityComment"("ticketId", "createdAt");
CREATE INDEX IF NOT EXISTS "CommunityComment_isHidden_idx" ON "CommunityComment"("isHidden");

-- Add foreign key constraint for CommunityComment
ALTER TABLE "CommunityComment" 
ADD CONSTRAINT "CommunityComment_ticketId_fkey" 
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;