-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "roleId" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModels" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Role" ("role", "roleId", "userId") SELECT "role", "roleId", "userId" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
