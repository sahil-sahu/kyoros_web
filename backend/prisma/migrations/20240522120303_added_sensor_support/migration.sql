-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "bedID" INTEGER,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_bedID_key" ON "Sensor"("bedID");

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_bedID_fkey" FOREIGN KEY ("bedID") REFERENCES "Bed"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
