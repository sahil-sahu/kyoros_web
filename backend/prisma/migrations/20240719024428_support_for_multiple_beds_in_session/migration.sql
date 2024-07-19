/*
  Warnings:

  - The `bedId` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `icuId` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_bedId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_icuId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "bedId",
ADD COLUMN     "bedId" INTEGER[],
DROP COLUMN "icuId",
ADD COLUMN     "icuId" INTEGER[];

-- CreateIndex
CREATE INDEX "Session_bedId_idx" ON "Session"("bedId");

-- CreateIndex
CREATE INDEX "Session_icuId_idx" ON "Session"("icuId");
