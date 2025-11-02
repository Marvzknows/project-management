-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activeBoardId" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_activeBoardId_fkey" FOREIGN KEY ("activeBoardId") REFERENCES "Board"("id") ON DELETE SET NULL ON UPDATE CASCADE;
