/*
  Warnings:

  - A unique constraint covering the columns `[uhid,hospitalId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "uhid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_uhid_hospitalId_key" ON "Patient"("uhid", "hospitalId");
