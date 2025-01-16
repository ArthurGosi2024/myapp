/*
  Warnings:

  - Added the required column `confirmEmailAccount` to the `SecurityModels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmEmailToken` to the `SecurityModels` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Security" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL,
    "isAccountLocked" BOOLEAN NOT NULL,
    "lockUntil" DATETIME,
    "passwordResetExpiration" DATETIME,
    "passwordResetToken" TEXT,
    "confirmEmailAccount" BOOLEAN NOT NULL,
    "confirmEmailToken" TEXT NOT NULL,
    "confirmEmailExpiration" DATETIME,
    CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModels" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Security" ("failedLoginAttempts", "id", "isAccountLocked", "lockUntil", "passwordResetExpiration", "passwordResetToken", "userId") SELECT "failedLoginAttempts", "id", "isAccountLocked", "lockUntil", "passwordResetExpiration", "passwordResetToken", "userId" FROM "SecurityModels";
DROP TABLE "SecurityModels";
ALTER TABLE "new_Security" RENAME TO "SecurityModels";
CREATE UNIQUE INDEX "Security_id_key" ON "SecurityModels"("id");
CREATE UNIQUE INDEX "Security_userId_key" ON "SecurityModels"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
