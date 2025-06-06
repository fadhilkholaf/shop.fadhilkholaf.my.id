/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_publicId_key" ON "Cart"("publicId");
