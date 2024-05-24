-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "sensorid" TEXT,
ALTER COLUMN "temp" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Watcher" (
    "id" SERIAL NOT NULL,
    "userid" TEXT NOT NULL,
    "icuId" INTEGER NOT NULL,

    CONSTRAINT "Watcher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Watcher" ADD CONSTRAINT "Watcher_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watcher" ADD CONSTRAINT "Watcher_icuId_fkey" FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_sensorid_fkey" FOREIGN KEY ("sensorid") REFERENCES "Sensor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
