-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_userid_fkey";

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
