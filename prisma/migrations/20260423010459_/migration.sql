/*
  Warnings:

  - You are about to drop the column `createdAt` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `especialistaId` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `estadoAnimo` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `pacienteEmail` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `pacienteNombre` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the `especialistas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sesiones` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `motivo` to the `citas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacienteId` to the `citas` table without a default value. This is not possible if the table is not empty.
  - Made the column `edad` on table `pacientes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `citas` DROP FOREIGN KEY `citas_especialistaId_fkey`;

-- DropForeignKey
ALTER TABLE `citas` DROP FOREIGN KEY `citas_pacienteEmail_fkey`;

-- DropForeignKey
ALTER TABLE `sesiones` DROP FOREIGN KEY `sesiones_citaId_fkey`;

-- AlterTable
ALTER TABLE `citas` DROP COLUMN `createdAt`,
    DROP COLUMN `especialistaId`,
    DROP COLUMN `estado`,
    DROP COLUMN `estadoAnimo`,
    DROP COLUMN `hora`,
    DROP COLUMN `pacienteEmail`,
    DROP COLUMN `pacienteNombre`,
    ADD COLUMN `motivo` VARCHAR(191) NOT NULL,
    ADD COLUMN `notas` TEXT NULL,
    ADD COLUMN `pacienteId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pacientes` DROP COLUMN `fechaNacimiento`,
    DROP COLUMN `notas`,
    MODIFY `edad` INTEGER NOT NULL;

-- DropTable
DROP TABLE `especialistas`;

-- DropTable
DROP TABLE `sesiones`;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
