-- CreateTable
CREATE TABLE "KnownProblem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipmentTypeId" INTEGER NOT NULL,

    CONSTRAINT "KnownProblem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KnownProblem" ADD CONSTRAINT "KnownProblem_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
