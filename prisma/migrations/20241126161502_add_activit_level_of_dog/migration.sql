/*
  Warnings:

  - Added the required column `activityLevel` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- AlterTable
ALTER TABLE "Dog" ADD COLUMN     "activityLevel" "ActivityLevel" NOT NULL,
ADD COLUMN     "image" TEXT;
