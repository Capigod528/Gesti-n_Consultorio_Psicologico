/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[userId]` on the table `especialistas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `especialistas` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('SECRETARIO', 'ESPECIALISTA') NOT NULL DEFAULT 'SECRETARIO';

-- CreateIndex
CREATE UNIQUE INDEX `especialistas_userId_key` ON `especialistas`(`userId`);

-- AddForeignKey
ALTER TABLE `especialistas` ADD CONSTRAINT `especialistas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
