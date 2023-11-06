/*
  Warnings:

  - You are about to drop the column `userProfileId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileId` on the `challenger` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileId` on the `show_case` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerify` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `user` table. All the data in the column will be lost.
  - The values [create] on the enum `work_statusWork` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `user_profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryImage` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `challenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `show_case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_reportById_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_reportedId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_userProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `challenger` DROP FOREIGN KEY `challenger_userProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_room` DROP FOREIGN KEY `chat_room_createrId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_room` DROP FOREIGN KEY `chat_room_dealerId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_reviewById_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_reviewerId_fkey`;

-- DropForeignKey
ALTER TABLE `show_case` DROP FOREIGN KEY `show_case_userProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `user_profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `work_workerId_fkey`;

-- DropIndex
DROP INDEX `user_email_key` ON `user`;

-- DropIndex
DROP INDEX `user_phoneNumber_key` ON `user`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `userProfileId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `categoryImage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `challenger` DROP COLUMN `userProfileId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `show_case` DROP COLUMN `userProfileId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    DROP COLUMN `isBanned`,
    DROP COLUMN `isVerify`,
    DROP COLUMN `password`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `userType`,
    ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `identifyId` VARCHAR(191) NULL,
    ADD COLUMN `identifyImage` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `personalDescription` TEXT NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `wallet` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `work` ADD COLUMN `isOnsite` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `addressLat` VARCHAR(191) NULL,
    MODIFY `addressLong` VARCHAR(191) NULL,
    MODIFY `statusWork` ENUM('adminReview', 'finding', 'makeDeal', 'acceptDeal', 'onProcess', 'requestSuccess', 'success', 'cancel', 'onIssue') NOT NULL;

-- DropTable
DROP TABLE `user_profile`;

-- CreateTable
CREATE TABLE `auth_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userType` ENUM('user', 'admin', 'system') NOT NULL DEFAULT 'user',
    `verifyStatus` ENUM('notVerify', 'pending', 'verify') NOT NULL DEFAULT 'notVerify',
    `isBanned` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `auth_user_email_key`(`email`),
    UNIQUE INDEX `auth_user_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_user` ADD CONSTRAINT `auth_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `show_case` ADD CONSTRAINT `show_case_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_reviewById_fkey` FOREIGN KEY (`reviewById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenger` ADD CONSTRAINT `challenger_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work` ADD CONSTRAINT `work_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_room` ADD CONSTRAINT `chat_room_createrId_fkey` FOREIGN KEY (`createrId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_room` ADD CONSTRAINT `chat_room_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportById_fkey` FOREIGN KEY (`reportById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportedId_fkey` FOREIGN KEY (`reportedId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
