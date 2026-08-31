-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'CRYPTO';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "providerRef" TEXT;
