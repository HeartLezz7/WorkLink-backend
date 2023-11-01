-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_ownerId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `userType` ENUM('user', 'admin', 'system') NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE `work` MODIFY `ownerId` INTEGER NULL,
    MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user_profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
