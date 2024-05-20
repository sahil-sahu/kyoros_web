-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'nurse', 'doctor');

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ICU" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "ICU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icuId" INTEGER NOT NULL,
    "occupied" BOOLEAN NOT NULL DEFAULT false,
    "patientId" TEXT,

    CONSTRAINT "Bed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "email" TEXT NOT NULL,
    "fireTokens" TEXT[],
    "firebaseUid" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "bedId" INTEGER,
    "gender" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT,
    "phone" VARCHAR(13) NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "bp" INTEGER[],
    "spo2" INTEGER NOT NULL,
    "temp" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "bedID" INTEGER NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientDoc" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "s3Link" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "PatientDoc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bed_patientId_key" ON "Bed"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ICU" ADD CONSTRAINT "ICU_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_icuId_fkey" FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_bedID_fkey" FOREIGN KEY ("bedID") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDoc" ADD CONSTRAINT "PatientDoc_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
