import {
  COLOR,
  PIECE_TYPE,
  RANK,
  type Color,
  type GameState,
  type PieceType,
  type Square,
} from '../models/game-state.js';
import { getRank, isPromotablePieceType } from '../utils/board-utils.js';

/**
 * 특정 칸이 현재 색상의 폰에게 프로모션 도착 칸인지 판정합니다.
 *
 * @param square 도착 칸으로 검사할 보드 인덱스
 * @param color 프로모션 가능 여부를 판단할 폰 색상
 * @returns 프로모션 도착 칸이면 `true`
 *
 * const promotable = isPromotionSquare(SQUARE.E8, COLOR.WHITE);
 */
export const isPromotionSquare = (square: Square, color: Color): boolean => {
  const rank = getRank(square);
  return color === COLOR.WHITE ? rank === RANK[8] : rank === RANK[1];
};

/**
 * 폰 이동 결과에 프로모션을 적용한 다음 게임 상태를 반환합니다.
 *
 * @param square 이동을 시작한 폰의 시작 칸
 * @param targetSquare 폰이 도달한 목적지 칸
 * @param state 현재 게임 상태
 * @param promotionPieceType 승격할 기물 타입, 없으면 기본값 정책을 따름
 * @returns 프로모션 적용 결과 상태, 아직 적용할 수 없으면 원본 상태
 *
 * const nextState = applyPromotion(SQUARE.E7, SQUARE.E8, state);
 */
export const applyPromotion = (
  square: Square,
  targetSquare: Square,
  state: GameState,
  promotionPieceType?: PieceType,
): GameState => {
  const piece = state.board[square];
  if (!piece || piece.type !== PIECE_TYPE.PAWN || piece.color !== state.turn) {
    return state;
  }

  if (!isPromotionSquare(targetSquare, state.turn)) {
    return state;
  }

  promotionPieceType ??= PIECE_TYPE.QUEEN;

  if (!isPromotablePieceType(promotionPieceType)) {
    return state;
  }

  const board = [...state.board];
  board[square] = null;
  board[targetSquare] = { type: promotionPieceType, color: state.turn };

  return {
    ...state,
    board,
  };
};
