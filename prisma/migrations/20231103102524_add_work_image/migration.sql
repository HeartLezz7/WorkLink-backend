/*
  Warnings:

  - You are about to drop the column `workTitle` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `workImage` to the `work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `workTitle`;

-- AlterTable
ALTER TABLE `work` ADD COLUMN `workImage` VARCHAR(191) NOT NULL;
