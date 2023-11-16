-- AlterTable
ALTER TABLE `report` ADD COLUMN `isClear` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `work` ADD COLUMN `addressName` VARCHAR(191) NULL;
