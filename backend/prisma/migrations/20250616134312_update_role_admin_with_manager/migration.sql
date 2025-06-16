/*
  Warnings:

  - The values [admin] on the enum `WorkspaceMemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceMemberRole_new" AS ENUM ('owner', 'manager', 'member');
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" TYPE "WorkspaceMemberRole_new" USING ("role"::text::"WorkspaceMemberRole_new");
ALTER TYPE "WorkspaceMemberRole" RENAME TO "WorkspaceMemberRole_old";
ALTER TYPE "WorkspaceMemberRole_new" RENAME TO "WorkspaceMemberRole";
DROP TYPE "WorkspaceMemberRole_old";
COMMIT;
