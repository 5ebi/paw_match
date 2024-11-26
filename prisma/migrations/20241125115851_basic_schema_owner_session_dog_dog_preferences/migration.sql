/*
  Warnings:

  - Made the column `postal_code` on table `Owner` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DogSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('PUPPY', 'YOUNG', 'ADULT', 'SENIOR');

-- AlterTable
ALTER TABLE "Owner" ALTER COLUMN "postal_code" SET NOT NULL;

-- CreateTable
CREATE TABLE "Dog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" "DogSize" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogPreferences" (
    "id" SERIAL NOT NULL,
    "prefersSmallDogs" BOOLEAN NOT NULL DEFAULT true,
    "prefersMediumDogs" BOOLEAN NOT NULL DEFAULT true,
    "prefersLargeDogs" BOOLEAN NOT NULL DEFAULT true,
    "prefersPuppy" BOOLEAN NOT NULL DEFAULT true,
    "prefersYoung" BOOLEAN NOT NULL DEFAULT true,
    "prefersAdult" BOOLEAN NOT NULL DEFAULT true,
    "prefersSenior" BOOLEAN NOT NULL DEFAULT true,
    "dogId" INTEGER NOT NULL,

    CONSTRAINT "DogPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dog_ownerId_idx" ON "Dog"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "DogPreferences_dogId_key" ON "DogPreferences"("dogId");

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogPreferences" ADD CONSTRAINT "DogPreferences_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
