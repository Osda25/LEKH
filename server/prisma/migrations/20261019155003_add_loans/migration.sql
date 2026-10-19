-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'RETURN_REQUESTED', 'RETURNED');

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "equipmentUnitId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_equipmentUnitId_fkey" FOREIGN KEY ("equipmentUnitId") REFERENCES "EquipmentUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
