/*
  Warnings:

  - You are about to drop the column `bpm` on the `Logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "bpm",
ADD COLUMN     "heart_rate" INTEGER NOT NULL DEFAULT 0;
