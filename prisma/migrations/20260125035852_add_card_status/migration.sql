-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "status" "CardStatus" NOT NULL DEFAULT 'TODO';
