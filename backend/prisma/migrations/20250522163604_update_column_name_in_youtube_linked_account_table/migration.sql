/*
  Warnings:

  - You are about to drop the column `expiresDate` on the `YoutubeLinkedAccount` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `YoutubeLinkedAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YoutubeLinkedAccount" DROP COLUMN "expiresDate",
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;
