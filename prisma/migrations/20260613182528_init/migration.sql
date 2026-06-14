-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episodeId" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descFa" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_episodeId_key" ON "Episode"("episodeId");
