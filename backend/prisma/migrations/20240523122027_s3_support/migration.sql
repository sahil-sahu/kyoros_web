/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `PatientDoc` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[s3Link]` on the table `PatientDoc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `PatientDoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PatientDoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientDoc" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoc_fileName_key" ON "PatientDoc"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoc_s3Link_key" ON "PatientDoc"("s3Link");
