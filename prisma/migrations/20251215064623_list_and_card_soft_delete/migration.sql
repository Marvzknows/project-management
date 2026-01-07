-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "deletedAt" TIMESTAMP(3);
