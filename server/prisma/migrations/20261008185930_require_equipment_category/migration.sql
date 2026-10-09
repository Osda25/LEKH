/*
  Warnings:

  - Made the column `category` on table `EquipmentType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EquipmentType" ALTER COLUMN "category" SET NOT NULL;
