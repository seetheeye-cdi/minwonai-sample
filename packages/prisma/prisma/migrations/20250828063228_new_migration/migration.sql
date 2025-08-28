/*
  Warnings:

  - You are about to drop the column `aiSuggestedCategory` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `aiSuggestedResponse` on the `Ticket` table. All the data in the column will be lost.
  - The `sentiment` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "aiSuggestedCategory",
DROP COLUMN "aiSuggestedResponse",
ADD COLUMN     "aiDraftAnswer" TEXT,
ADD COLUMN     "aiErrorMessage" TEXT,
ADD COLUMN     "aiNeedsManualReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiSummary" TEXT,
DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" "public"."Sentiment";
