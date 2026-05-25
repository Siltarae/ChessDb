-- AlterTable
ALTER TABLE "repositories" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "games" ADD COLUMN "deleted_at" TIMESTAMPTZ(6);
