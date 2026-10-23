-- CreateEnum
CREATE TYPE "FaultReportStatus" AS ENUM ('OPEN', 'REVIEWED');

-- AlterTable
ALTER TABLE "FaultReport" ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "status" "FaultReportStatus" NOT NULL DEFAULT 'OPEN';
