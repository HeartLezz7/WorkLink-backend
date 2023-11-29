/*
  Warnings:

  - You are about to drop the column `recieverId` on the `chat_room` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `chat_room` table. All the data in the column will be lost.
  - Added the required column `createrId` to the `chat_room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dealerId` to the `chat_room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chat_room` DROP FOREIGN KEY `chat_room_recieverId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_room` DROP FOREIGN KEY `chat_room_senderId_fkey`;

-- AlterTable
ALTER TABLE `chat_room` DROP COLUMN `recieverId`,
    DROP COLUMN `senderId`,
    ADD COLUMN `createrId` INTEGER NOT NULL,
    ADD COLUMN `dealerId` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('disable', 'available') NOT NULL DEFAULT 'available';

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(255) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chatRoomId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_room` ADD CONSTRAINT `chat_room_createrId_fkey` FOREIGN KEY (`createrId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_room` ADD CONSTRAINT `chat_room_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `chat_room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
