/*
  Warnings:

  - You are about to drop the column `destinationLocation` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocation` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `destinationLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationLng` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLng` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destinationLocation",
DROP COLUMN "pickupLocation",
ADD COLUMN     "destinationLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "destinationLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLng" DOUBLE PRECISION NOT NULL;
