-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "replyTo" TEXT;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "Notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
