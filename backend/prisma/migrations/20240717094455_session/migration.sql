-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "doctorIds" TEXT[],
    "nurseIds" TEXT[],
    "patientId" TEXT NOT NULL,
    "bedId" INTEGER NOT NULL,
    "bedName" TEXT NOT NULL,
    "icuName" TEXT NOT NULL,
    "icuId" INTEGER NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "apache" INTEGER NOT NULL,
    "admittedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "comorbidities" TEXT[],
    "diagnosis" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_bedId_idx" ON "Session"("bedId");

-- CreateIndex
CREATE INDEX "Session_icuId_idx" ON "Session"("icuId");

-- CreateIndex
CREATE INDEX "Session_hospitalId_idx" ON "Session"("hospitalId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_icuId_fkey" FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
