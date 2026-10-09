-- AlterTable
ALTER TABLE "EquipmentType" ADD COLUMN     "category" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
