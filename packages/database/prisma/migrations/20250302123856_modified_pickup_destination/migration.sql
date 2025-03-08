/*
  Warnings:

  - You are about to drop the column `destination` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `pickup` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `destinationLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLocation` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destination",
DROP COLUMN "pickup",
ADD COLUMN     "destinationLocation" JSONB NOT NULL,
ADD COLUMN     "pickupLocation" JSONB NOT NULL;
