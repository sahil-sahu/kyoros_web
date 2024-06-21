/*
  Warnings:

  - The primary key for the `Criticality` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Criticality" DROP CONSTRAINT "Criticality_pkey",
ALTER COLUMN "timeStamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "timeStamp" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "Criticality_pkey" PRIMARY KEY ("patientId", "bedID", "timeStamp");
