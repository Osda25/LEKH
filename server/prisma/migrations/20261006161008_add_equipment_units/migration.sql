-- CreateEnum
CREATE TYPE "UnitCondition" AS ENUM ('IN_SERVICE', 'OUT_OF_SERVICE');

-- CreateTable
CREATE TABLE "EquipmentUnit" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "condition" "UnitCondition" NOT NULL DEFAULT 'IN_SERVICE',
    "equipmentTypeId" INTEGER NOT NULL,

    CONSTRAINT "EquipmentUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentUnit_identifier_key" ON "EquipmentUnit"("identifier");

-- AddForeignKey
ALTER TABLE "EquipmentUnit" ADD CONSTRAINT "EquipmentUnit_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
