-- Existing development game data cannot be mapped safely without a repository policy.
DELETE FROM "game_moves";
DELETE FROM "games";

-- AlterTable
ALTER TABLE "games" ADD COLUMN "repository_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
