/*
  Warnings:

  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[availability_id]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availability_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_clientId_fkey";

-- DropIndex
DROP INDEX "Reservation_availabilityId_key";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "availabilityId",
DROP COLUMN "clientId",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "availability_id" INTEGER NOT NULL,
ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_availability_id_key" ON "Reservation"("availability_id");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_availability_id_fkey" FOREIGN KEY ("availability_id") REFERENCES "Availability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
