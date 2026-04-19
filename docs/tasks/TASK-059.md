# 📋 개별 작업 지침서: 체스 보드 상태 데이터 모델 정의 (TASK-059)

**작업 상태**: 완료  
**선행 작업**: `[TASK-087]`  
**후속 작업**: `[TASK-004]` (폰 로직)  
**연관 설계**: `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 핵심 도메인 모델(Color, PieceType, Square, GameState)이 구현되었습니다.
- **이 작업의 위치**: 체스 엔진의 근간이 되는 데이터 구조를 정의했습니다. 비트 마스크와 숫자 기반 상수를 사용하여 성능을 극대화했습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 체스 보드, 기물, 게임 상태를 표현하는 TypeScript 타입, 상수, Zod 스키마가 정의되었습니다.
- **성공 기준 (AC)**:
  - 64칸 1차원 배열을 사용하며, 인덱스 0은 `a1`, 63은 `h8`을 의미한다.
  - 색상과 기물 타입은 숫자로 정의되어 비교 연산 성능을 최적화한다.
  - 캐슬링 권한을 비트 마스크(`number`)로 관리하여 연산 효율을 높였다.

## 🛠️ 3. 상세 기술 사양

- **핵심 데이터 모델**:

  ```ts
  // 1. 숫자 기반 상수 정의 (UPPER_SNAKE_CASE)
  export const COLOR = { WHITE: 0, BLACK: 1 } as const;
  export type Color = (typeof COLOR)[keyof typeof COLOR];

  export const PIECE_TYPE = {
    NONE: 0,
    PAWN: 1,
    KNIGHT: 2,
    BISHOP: 3,
    ROOK: 4,
    QUEEN: 5,
    KING: 6,
  } as const;
  export type PieceType = (typeof PIECE_TYPE)[keyof typeof PIECE_TYPE];

  // 2. 비트 마스크 기반 캐슬링 권한
  export const CASTLE = {
    WHITE_KING_SIDE: 1,
    WHITE_QUEEN_SIDE: 2,
    BLACK_KING_SIDE: 4,
    BLACK_QUEEN_SIDE: 8,
  } as const;
  export type Castle = (typeof CASTLE)[keyof typeof CASTLE];

  // 3. 기물 객체
  export interface Piece {
    readonly type: PieceType;
    readonly color: Color;
  }

  // 4. 1차원 배열 보드 (0=a1, 63=h8)
  export type Board = readonly (Piece | null)[];

  // 5. 게임 전체 상태
  export interface GameState {
    readonly board: Board;
    readonly turn: Color;
    readonly castlingRights: number; // Bit mask using CASTLE constants
    readonly enPassantSquare: number | null;
    readonly halfmoveClock: number;
    readonly fullmoveNumber: number;
  }
  ```

## ✅ 4. 완료 판정 체크리스트

- [x] `COLOR`, `PIECE_TYPE`이 대문자 상수로 정의되고 `NONE` 타입이 포함되었다.
- [x] 캐슬링 권한이 비트 마스크(`number`) 방식으로 구현되었다.
- [x] `SQUARE.A1`~`SQUARE.H8` 명칭으로 매핑된 상수가 존재한다.
- [x] `GameState`를 검증하는 Zod 스키마가 작성되었다.

## 🚧 5. 실행 중 발생한 문제 및 해결

- 가독성과 성능 사이의 균형을 위해 문자열 대신 숫자 기반 상수를 채택함.
- `UPPER_SNAKE_CASE` 상수 규칙과 `PascalCase` 타입 명칭을 분리하여 명확성을 확보함.
- ESLint의 네이밍 규칙을 수정하여 타입처럼 사용되는 상수 객체를 허용함.
- 캐슬링 권한을 객체 구조에서 비트 마스크 숫자로 변경하여 성능 최적화.

## 💬 9. 추천 커밋 메시지

- `feat: 고성능 숫자 기반 체스 데이터 모델 정의 (TASK-059)`
