/*
  Warnings:

  - The primary key for the `Criticality` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Criticality" DROP CONSTRAINT "Criticality_pkey",
ADD CONSTRAINT "Criticality_pkey" PRIMARY KEY ("patientId", "bedID", "timeStamp");
