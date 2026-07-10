-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descFa" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "episodeNum" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "score" INTEGER NOT NULL DEFAULT 0,
    "fwr" REAL NOT NULL DEFAULT 0,
    "wpm" REAL NOT NULL DEFAULT 0,
    "lexicalDiversity" REAL NOT NULL DEFAULT 0,
    "rejectionReason" TEXT,
    "transcript" TEXT,
    "aiAnalysis" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "seasonId" INTEGER,
    CONSTRAINT "Episode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("aiAnalysis", "audioUrl", "coverUrl", "createdAt", "descEn", "descFa", "duration", "episodeNum", "id", "seasonId", "status", "titleEn", "titleFa", "transcript", "userId") SELECT "aiAnalysis", "audioUrl", "coverUrl", "createdAt", "descEn", "descFa", "duration", "episodeNum", "id", "seasonId", "status", "titleEn", "titleFa", "transcript", "userId" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE UNIQUE INDEX "Episode_seasonId_episodeNum_key" ON "Episode"("seasonId", "episodeNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
