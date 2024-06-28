-- AlterTable
ALTER TABLE "Bed" ADD COLUMN     "latest" JSONB;

-- CreateIndex
CREATE INDEX "Bed_patientId_idx" ON "Bed"("patientId");

-- CreateIndex
CREATE INDEX "Logs_timeStamp_idx" ON "Logs"("timeStamp");

-- CreateIndex
CREATE INDEX "Watcher_userid_idx" ON "Watcher"("userid");

-- CreateIndex
CREATE INDEX "Watcher_icuId_idx" ON "Watcher"("icuId");
