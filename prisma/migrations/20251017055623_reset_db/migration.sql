/*
  Warnings:

  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `user` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "middleName",
ALTER COLUMN "name" SET NOT NULL;
