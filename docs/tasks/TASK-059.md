# 📋 개별 작업 지침서: 체스 보드 상태 데이터 모델 정의 (TASK-059)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-087]`  
**후속 작업**: `[TASK-004]` (폰 로직)  
**연관 설계**: `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 테스트 환경만 구축된 빈 패키지입니다.
- **이 작업의 책임**: 체스 게임의 전역 상태를 표현하는 **가장 핵심적인 데이터 구조(Domain Model)**를 정의합니다. 이 모델은 이후 모든 합법 수 판정 로직의 입력값이 됩니다.

## 🎯 1. 작업 목표

- **최종 상태**: 체스 보드, 기물, 위치, 턴, 특수 상황(캐슬링 권리 등)을 표현하는 TypeScript 타입 및 Zod 스키마가 정의됩니다.
- **성공 기준 (AC)**:
  - 8x8 보드를 표현하는 효율적인 데이터 구조를 갖춘다.
  - `FEN` 문자열의 데이터 요소를 모두 포함하는 상태 객체를 정의한다.

## 🛠️ 3. 상세 기술 사양

- **핵심 타입 시그니처**:
  ```ts
  export type Color = 'w' | 'b';
  export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  export type Piece = { type: PieceType; color: Color };
  export type Square = string; // 'a1', 'h8' 등
  export type Board = Record<Square, Piece | null>;

  export interface GameState {
    board: Board;
    turn: Color;
    castlingRights: { w: { ks: boolean; qs: boolean }; b: { ks: boolean; qs: boolean } };
    enPassantSquare: Square | null;
    halfmoveClock: number;
    fullmoveNumber: number;
  }
  ```
- **권장 네이밍**: `Color`, `PieceType`, `GameState`

## ✅ 4. 완료 판정 체크리스트

- [ ] 모든 기물 종류와 색상이 타입으로 정의되었다.
- [ ] 8x8 좌표 체계(a1~h8)를 다루는 유틸리티 타입/상수가 마련되었다.
- [ ] `GameState` 인터페이스가 체스 규칙에 필요한 모든 상태를 포함한다.


## 💬 9. 추천 커밋 메시지

- `feat: 체스 보드 상태 데이터 모델 정의 (TASK-059)`
