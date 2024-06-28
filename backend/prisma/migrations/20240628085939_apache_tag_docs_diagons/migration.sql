/*
  Warnings:

  - You are about to drop the `Criticality` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Pathology', 'Radiology', 'Microbiology', 'General');

-- DropForeignKey
ALTER TABLE "Criticality" DROP CONSTRAINT "Criticality_bedID_fkey";

-- DropForeignKey
ALTER TABLE "Criticality" DROP CONSTRAINT "Criticality_patientId_fkey";

-- AlterTable
ALTER TABLE "Bed" ADD COLUMN     "apache" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "Medicines" TEXT[],
ADD COLUMN     "Surgeries" TEXT[],
ADD COLUMN     "comorbidities" TEXT[];

-- AlterTable
ALTER TABLE "PatientDoc" ADD COLUMN     "tag" "Tag";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "Criticality";

-- CreateTable
CREATE TABLE "PatientHistory" (
    "id" TEXT NOT NULL,
    "diagnosis" TEXT,
    "comorbidities" TEXT[],
    "Surgeries" TEXT[],
    "Medicines" TEXT[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientHistory_pkey" PRIMARY KEY ("id")
);
