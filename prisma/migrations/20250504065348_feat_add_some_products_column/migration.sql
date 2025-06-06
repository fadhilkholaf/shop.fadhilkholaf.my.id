/*
  Warnings:

  - A unique constraint covering the columns `[repositoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "repositoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_repositoryId_key" ON "Product"("repositoryId");
