-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "avatarType" TEXT NOT NULL DEFAULT 'procedural',
    "avatarFilter" TEXT NOT NULL DEFAULT 'none',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "creatorStatus" TEXT NOT NULL DEFAULT 'none',
    "auditionCount" INTEGER NOT NULL DEFAULT 0,
    "auditionAudioUrl" TEXT,
    "auditionFeedback" TEXT,
    "auditionScore" INTEGER NOT NULL DEFAULT 0,
    "phone" TEXT
);
INSERT INTO "new_User" ("avatarFilter", "avatarType", "avatarUrl", "bio", "createdAt", "email", "field", "fullName", "id") SELECT "avatarFilter", "avatarType", "avatarUrl", "bio", "createdAt", "email", "field", "fullName", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
