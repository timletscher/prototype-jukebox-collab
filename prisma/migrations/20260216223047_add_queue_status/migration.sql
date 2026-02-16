-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QueueItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "addedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" DATETIME
);
INSERT INTO "new_QueueItem" ("addedBy", "createdAt", "id", "order", "title", "url") SELECT "addedBy", "createdAt", "id", "order", "title", "url" FROM "QueueItem";
DROP TABLE "QueueItem";
ALTER TABLE "new_QueueItem" RENAME TO "QueueItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
