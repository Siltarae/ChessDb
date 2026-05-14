-- CreateEnum
CREATE TYPE "game_result" AS ENUM ('ONGOING', 'WHITE_WIN', 'BLACK_WIN', 'DRAW');

-- CreateEnum
CREATE TYPE "game_termination_reason" AS ENUM ('CHECKMATE', 'STALEMATE', 'FIFTY_MOVE', 'THREEFOLD_REPETITION', 'INSUFFICIENT_MATERIAL', 'RESIGNATION', 'AGREEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "move_annotation" AS ENUM ('BRILLIANT', 'GOOD', 'INTERESTING', 'DUBIOUS', 'MISTAKE', 'BLUNDER');

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "result" "game_result" NOT NULL,
    "termination_reason" "game_termination_reason",
    "played_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_moves" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "half_move_index" INTEGER NOT NULL,
    "san" VARCHAR NOT NULL,
    "move" JSONB NOT NULL,
    "comment" TEXT,
    "annotation" "move_annotation",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "game_moves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_moves_game_id_half_move_index_key" ON "game_moves"("game_id", "half_move_index");

-- AddForeignKey
ALTER TABLE "game_moves" ADD CONSTRAINT "game_moves_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
