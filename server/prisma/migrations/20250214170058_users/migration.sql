/*
  Warnings:

  - Added the required column `accountID` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `accountID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Profiles` ADD CONSTRAINT `Profiles_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
