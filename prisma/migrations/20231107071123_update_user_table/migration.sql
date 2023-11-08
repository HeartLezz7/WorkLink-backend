/*
  Warnings:

  - The values [acceptDeal] on the enum `work_statusWork` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `work` MODIFY `statusWork` ENUM('adminReview', 'finding', 'makeDeal', 'onProcess', 'requestSuccess', 'success', 'cancel', 'onIssue') NOT NULL;
