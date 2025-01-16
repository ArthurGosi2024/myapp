/*
  Warnings:

  - You are about to drop the `SecurityModels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserModels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Security_userId_key";

-- DropIndex
DROP INDEX "Security_id_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SecurityModels";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserModels";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Security" (
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
    CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "roleId" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Role" ("role", "roleId", "userId") SELECT "role", "roleId", "userId" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Security_id_key" ON "Security"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Security_userId_key" ON "Security"("userId");
