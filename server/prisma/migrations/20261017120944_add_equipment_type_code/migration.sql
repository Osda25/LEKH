-- AlterTable
ALTER TABLE "EquipmentType" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "EquipmentUnit" ALTER COLUMN "identifier" DROP NOT NULL;
