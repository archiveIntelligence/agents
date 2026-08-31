-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "highlights" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "monograph" JSONB;
