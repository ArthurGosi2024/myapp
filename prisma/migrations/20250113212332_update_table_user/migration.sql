-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_User" ("age", "dateOfBirth", "email", "name", "password", "phone", "userId") SELECT "age", "dateOfBirth", "email", "name", "password", "phone", "userId" FROM "UserModels";
DROP TABLE "UserModels";
ALTER TABLE "new_User" RENAME TO "UserModels";
CREATE UNIQUE INDEX "User_userId_key" ON "UserModels"("userId");
CREATE UNIQUE INDEX "User_email_key" ON "UserModels"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
