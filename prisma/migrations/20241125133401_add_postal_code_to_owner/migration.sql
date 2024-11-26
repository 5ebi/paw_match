/*
  Warnings:

  - You are about to drop the column `created_at` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `postalCode` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Made the column `verified` on table `Owner` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "created_at",
DROP COLUMN "postal_code",
DROP COLUMN "verification_code",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "verificationCode" TEXT,
ALTER COLUMN "verified" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
