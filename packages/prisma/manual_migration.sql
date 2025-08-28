-- Add community fields to Ticket table
ALTER TABLE "Ticket" 
ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "publicExcerpt" TEXT,
ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'internal',
ADD COLUMN IF NOT EXISTS "nickname" TEXT;

-- Create indexes for Ticket table
CREATE INDEX IF NOT EXISTS "Ticket_isPublic_createdAt_idx" ON "Ticket"("isPublic", "createdAt");
CREATE INDEX IF NOT EXISTS "Ticket_source_idx" ON "Ticket"("source");

-- Create CommunityLike table
CREATE TABLE IF NOT EXISTS "CommunityLike" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityLike_pkey" PRIMARY KEY ("id")
);

-- Create indexes for CommunityLike
CREATE UNIQUE INDEX IF NOT EXISTS "CommunityLike_ticketId_ipHash_key" ON "CommunityLike"("ticketId", "ipHash");
CREATE INDEX IF NOT EXISTS "CommunityLike_ticketId_idx" ON "CommunityLike"("ticketId");
CREATE INDEX IF NOT EXISTS "CommunityLike_createdAt_idx" ON "CommunityLike"("createdAt");

-- Create CommunityComment table
CREATE TABLE IF NOT EXISTS "CommunityComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '익명',
    "content" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- Create indexes for CommunityComment
CREATE INDEX IF NOT EXISTS "CommunityComment_ticketId_createdAt_idx" ON "CommunityComment"("ticketId", "createdAt");
CREATE INDEX IF NOT EXISTS "CommunityComment_isHidden_idx" ON "CommunityComment"("isHidden");

-- Add foreign key constraints
ALTER TABLE "CommunityLike" ADD CONSTRAINT "CommunityLike_ticketId_fkey" 
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_ticketId_fkey" 
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
