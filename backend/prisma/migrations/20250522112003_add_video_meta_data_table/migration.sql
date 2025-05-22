-- CreateTable
CREATE TABLE "VideoMetaData" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "privacyStatus" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,

    CONSTRAINT "VideoMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoMetaData_workspaceId_idx" ON "VideoMetaData"("workspaceId");

-- CreateIndex
CREATE INDEX "VideoMetaData_uploaderId_idx" ON "VideoMetaData"("uploaderId");

-- AddForeignKey
ALTER TABLE "VideoMetaData" ADD CONSTRAINT "VideoMetaData_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
