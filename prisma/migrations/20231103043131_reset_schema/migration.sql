/*
  Warnings:

  - Made the column `ownerId` on table `work` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `work` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_ownerId_fkey`;

-- AlterTable
ALTER TABLE `user_profile` MODIFY `identifyId` VARCHAR(191) NULL,
    MODIFY `identifyImage` VARCHAR(191) NULL,
    MODIFY `birthDate` DATETIME(3) NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `personalDescription` VARCHAR(255) NULL,
    MODIFY `wallet` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `work` MODIFY `ownerId` INTEGER NOT NULL,
    MODIFY `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
