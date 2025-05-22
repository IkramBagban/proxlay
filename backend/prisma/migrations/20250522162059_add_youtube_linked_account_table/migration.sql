-- CreateTable
CREATE TABLE "YoutubeLinkedAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeLinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YoutubeLinkedAccount_workspaceId_idx" ON "YoutubeLinkedAccount"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeLinkedAccount_userId_key" ON "YoutubeLinkedAccount"("userId");

-- AddForeignKey
ALTER TABLE "YoutubeLinkedAccount" ADD CONSTRAINT "YoutubeLinkedAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
