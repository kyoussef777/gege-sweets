-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
