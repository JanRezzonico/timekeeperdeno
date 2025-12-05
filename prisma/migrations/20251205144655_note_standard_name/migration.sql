/*
  Warnings:

  - You are about to drop the column `notes` on the `Exception` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exception" DROP COLUMN "notes",
ADD COLUMN     "note" TEXT NOT NULL DEFAULT '';
