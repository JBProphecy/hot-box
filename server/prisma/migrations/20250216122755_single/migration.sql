/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deviceaccounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deviceprofiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `profiles` DROP FOREIGN KEY `Profiles_accountID_fkey`;

-- DropTable
DROP TABLE `accounts`;

-- DropTable
DROP TABLE `deviceaccounts`;

-- DropTable
DROP TABLE `deviceprofiles`;

-- DropTable
DROP TABLE `profiles`;

-- CreateTable
CREATE TABLE `DeviceAccount` (
    `deviceID` VARCHAR(191) NOT NULL,
    `accountID` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,

    PRIMARY KEY (`deviceID`, `accountID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceProfile` (
    `deviceID` VARCHAR(191) NOT NULL,
    `profileID` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,

    PRIMARY KEY (`deviceID`, `profileID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accountID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Profile_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
