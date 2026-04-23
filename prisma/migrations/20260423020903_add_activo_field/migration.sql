/*
  Warnings:

  - Added the required column `especialistaId` to the `citas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `citas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `citas` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `especialistaId` INTEGER NOT NULL,
    ADD COLUMN `estado` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pacientes` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `especialistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `especialistas_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_especialistaId_fkey` FOREIGN KEY (`especialistaId`) REFERENCES `especialistas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
