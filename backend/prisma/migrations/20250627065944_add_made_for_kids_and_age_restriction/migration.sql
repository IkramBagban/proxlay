-- AlterTable
ALTER TABLE "VideoMetaData" ADD COLUMN     "ageRestriction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "madeForKids" BOOLEAN NOT NULL DEFAULT false;
