/*
  Warnings:

  - You are about to drop the column `workCategoriesId` on the `work` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workId` to the `challenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewById` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `challenger` ADD COLUMN `workId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `reviewById` INTEGER NOT NULL,
    ADD COLUMN `reviewerId` INTEGER NOT NULL,
    ADD COLUMN `workId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `work` DROP COLUMN `workCategoriesId`,
    MODIFY `endDate` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_phoneNumber_key` ON `user`(`phoneNumber`);

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `work`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_reviewById_fkey` FOREIGN KEY (`reviewById`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenger` ADD CONSTRAINT `challenger_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `work`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
