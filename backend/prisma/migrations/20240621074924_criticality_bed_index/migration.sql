-- CreateTable
CREATE TABLE "Criticality" (
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "bedID" INTEGER NOT NULL,
    "criticality" INTEGER NOT NULL,

    CONSTRAINT "Criticality_pkey" PRIMARY KEY ("patientId","bedID")
);

-- CreateIndex
CREATE INDEX "Criticality_patientId_idx" ON "Criticality"("patientId");

-- CreateIndex
CREATE INDEX "Criticality_bedID_idx" ON "Criticality"("bedID");

-- CreateIndex
CREATE INDEX "Bed_icuId_idx" ON "Bed"("icuId");

-- AddForeignKey
ALTER TABLE "Criticality" ADD CONSTRAINT "Criticality_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criticality" ADD CONSTRAINT "Criticality_bedID_fkey" FOREIGN KEY ("bedID") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
