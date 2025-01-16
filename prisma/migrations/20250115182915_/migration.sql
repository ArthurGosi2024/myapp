/*
  Warnings:

  - You are about to alter the column `lockUntil` on the `Security` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Security" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL,
    "isAccountLocked" BOOLEAN NOT NULL,
    "lockUntil" BIGINT NOT NULL,
    "passwordResetExpiration" TEXT NOT NULL,
    "passwordResetToken" TEXT,
    "confirmEmailAccount" BOOLEAN NOT NULL,
    "confirmEmailToken" TEXT NOT NULL,
    "confirmEmailExpiration" TEXT NOT NULL,
    CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Security" ("confirmEmailAccount", "confirmEmailExpiration", "confirmEmailToken", "failedLoginAttempts", "id", "isAccountLocked", "lockUntil", "passwordResetExpiration", "passwordResetToken", "userId") SELECT "confirmEmailAccount", "confirmEmailExpiration", "confirmEmailToken", "failedLoginAttempts", "id", "isAccountLocked", "lockUntil", "passwordResetExpiration", "passwordResetToken", "userId" FROM "Security";
DROP TABLE "Security";
ALTER TABLE "new_Security" RENAME TO "Security";
CREATE UNIQUE INDEX "Security_id_key" ON "Security"("id");
CREATE UNIQUE INDEX "Security_userId_key" ON "Security"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
