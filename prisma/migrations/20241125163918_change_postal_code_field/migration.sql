/*
  Warnings:

  - You are about to drop the column `postalCode` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `postal_code` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostalCode" AS ENUM ('PLZ_1010', 'PLZ_1020', 'PLZ_1030', 'PLZ_1040', 'PLZ_1050', 'PLZ_1060', 'PLZ_1070', 'PLZ_1080', 'PLZ_1090', 'PLZ_1100', 'PLZ_1110', 'PLZ_1120', 'PLZ_1130', 'PLZ_1140', 'PLZ_1150', 'PLZ_1160', 'PLZ_1170', 'PLZ_1180', 'PLZ_1190', 'PLZ_1200', 'PLZ_1210', 'PLZ_1220', 'PLZ_1230');

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "postalCode",
ADD COLUMN     "postal_code" "PostalCode" NOT NULL;
