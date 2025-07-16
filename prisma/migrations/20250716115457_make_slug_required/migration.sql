/*
  Warnings:

  - Made the column `slug` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "mood" TEXT NOT NULL,
    "image" TEXT,
    "steamUrl" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("createdAt", "description", "id", "image", "mood", "name", "popularity", "slug", "steamUrl") SELECT "createdAt", "description", "id", "image", "mood", "name", "popularity", "slug", "steamUrl" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
