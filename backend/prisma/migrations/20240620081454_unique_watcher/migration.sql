/*
  Warnings:

  - A unique constraint covering the columns `[userid,icuId]` on the table `Watcher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Watcher_userid_icuId_key" ON "Watcher"("userid", "icuId");
