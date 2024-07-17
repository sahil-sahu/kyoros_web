-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'nurse', 'doctor');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Pathology', 'Radiology', 'Microbiology', 'General');

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
CREATE TABLE "Watcher" (
    "id" SERIAL NOT NULL,
    "userid" TEXT NOT NULL,
    "icuId" INTEGER NOT NULL,

    CONSTRAINT "Watcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icuId" INTEGER NOT NULL,
    "occupied" BOOLEAN NOT NULL DEFAULT false,
    "patientId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latest" JSONB,
    "apache" INTEGER DEFAULT 0,
    "bedStamp" TIMESTAMP(3),
    "hospitalId" TEXT NOT NULL,

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
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,

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
    "dept" TEXT,
    "diagnosis" TEXT,
    "Medicines" TEXT[],
    "Surgeries" TEXT[],
    "comorbidities" TEXT[],
    "uhid" TEXT,
    "dob" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "bp" INTEGER[],
    "spo2" INTEGER NOT NULL,
    "temp" DOUBLE PRECISION,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "bedID" INTEGER NOT NULL,
    "sensorid" TEXT,
    "heart_rate" INTEGER NOT NULL DEFAULT 0,
    "pulse" INTEGER NOT NULL DEFAULT 0,
    "resp_rate" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientDoc" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "s3Link" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" "Tag",

    CONSTRAINT "PatientDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "bedID" INTEGER,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Watcher_userid_idx" ON "Watcher"("userid");

-- CreateIndex
CREATE INDEX "Watcher_icuId_idx" ON "Watcher"("icuId");

-- CreateIndex
CREATE UNIQUE INDEX "Watcher_userid_icuId_key" ON "Watcher"("userid", "icuId");

-- CreateIndex
CREATE UNIQUE INDEX "Bed_patientId_key" ON "Bed"("patientId");

-- CreateIndex
CREATE INDEX "Bed_icuId_idx" ON "Bed"("icuId");

-- CreateIndex
CREATE INDEX "Bed_patientId_idx" ON "Bed"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_uhid_hospitalId_key" ON "Patient"("uhid", "hospitalId");

-- CreateIndex
CREATE INDEX "Logs_patientId_timeStamp_idx" ON "Logs"("patientId", "timeStamp");

-- CreateIndex
CREATE INDEX "Logs_bedID_timeStamp_idx" ON "Logs"("bedID", "timeStamp");

-- CreateIndex
CREATE INDEX "Logs_timeStamp_idx" ON "Logs"("timeStamp");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoc_s3Link_key" ON "PatientDoc"("s3Link");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoc_fileName_key" ON "PatientDoc"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_bedID_key" ON "Sensor"("bedID");

-- AddForeignKey
ALTER TABLE "ICU" ADD CONSTRAINT "ICU_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watcher" ADD CONSTRAINT "Watcher_icuId_fkey" FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watcher" ADD CONSTRAINT "Watcher_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_icuId_fkey" FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_bedID_fkey" FOREIGN KEY ("bedID") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_sensorid_fkey" FOREIGN KEY ("sensorid") REFERENCES "Sensor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDoc" ADD CONSTRAINT "PatientDoc_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_bedID_fkey" FOREIGN KEY ("bedID") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

