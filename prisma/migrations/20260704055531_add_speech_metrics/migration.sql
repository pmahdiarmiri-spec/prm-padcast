-- AlterTable
ALTER TABLE "Episode" ADD COLUMN "aiAnalysis" TEXT;
ALTER TABLE "Episode" ADD COLUMN "transcript" TEXT;

-- CreateTable
CREATE TABLE "AiHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "audioUrl" TEXT,
    "transcription" TEXT NOT NULL,
    "analysis" TEXT,
    "summaryFa" TEXT,
    "summaryEn" TEXT,
    "linkedinPost" TEXT,
    "githubSummary" TEXT,
    "fwr" REAL,
    "wpm" REAL,
    "wpmStatus" TEXT,
    "lexicalDiversity" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
