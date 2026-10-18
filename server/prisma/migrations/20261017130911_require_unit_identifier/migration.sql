/*
  Warnings:

  - Made the column `identifier` on table `EquipmentUnit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EquipmentUnit" ALTER COLUMN "identifier" SET NOT NULL;
