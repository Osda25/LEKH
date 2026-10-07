-- CreateTable
CREATE TABLE "EquipmentGuide" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "equipmentTypeId" INTEGER NOT NULL,

    CONSTRAINT "EquipmentGuide_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EquipmentGuide" ADD CONSTRAINT "EquipmentGuide_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
