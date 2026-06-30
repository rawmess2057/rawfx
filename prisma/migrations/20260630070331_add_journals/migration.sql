/*
  Warnings:

  - You are about to drop the column `contextTimeframe` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `entryTimeframe` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `validationTimeframe` on the `Trade` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('BACKTEST', 'FORWARD', 'LIVE');

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "contextTimeframe",
DROP COLUMN "entryTimeframe",
DROP COLUMN "validationTimeframe",
ADD COLUMN     "journalId" TEXT;

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "JournalType" NOT NULL DEFAULT 'LIVE',
    "strategy" TEXT NOT NULL DEFAULT '',
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
