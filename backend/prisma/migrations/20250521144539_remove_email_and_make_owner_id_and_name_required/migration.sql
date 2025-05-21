/*
  Warnings:

  - You are about to drop the column `email` on the `Workspace` table. All the data in the column will be lost.
  - Made the column `name` on table `Workspace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Workspace_email_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "email",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;
