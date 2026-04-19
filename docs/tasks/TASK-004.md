# 📋 개별 작업 지침서: 폰(Pawn) 합법 수 판정 (TASK-004)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-059]`  
**후속 작업**: `[TASK-005]` (나이트 로직)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `TASK-059`를 통해 `COLOR`, `PIECE_TYPE`, `SQUARE` 등 핵심 데이터 모델과 `GameState` 타입이 정의되었습니다. `getPawnMoves` 함수는 빈 배열을 반환하는 스켈레톤 상태입니다.
- **이 작업의 책임**: 폰(Pawn)의 기본적인 이동 규칙(1칸 전진, 2칸 전진, 대각선 캡처)을 구현합니다.
- **이번 작업에서 하지 않는 것**: 앙파상(En Passant) 규칙과 승진(Promotion) 규칙은 후속 태스크(`TASK-003`, `TASK-010`)에서 처리합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 주어진 위치에 있는 폰의 색상을 식별하고, 현재 보드 상태에서 이동 가능한 모든 좌표(0-63 인덱스) 배열을 반환합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/pawn-engine.ts` 내 `getPawnMoves` 로직 완성.
  - `packages/shared/src/engines/pawn-engine.spec.ts` 테스트 통과.
- **성공 기준 (AC)**:
  - 흰색 폰은 인덱스 증가 방향(+8, +16)으로, 검은색 폰은 인덱스 감소 방향(-8, -16)으로 이동한다.
  - 전진 경로에 어떤 기물이라도 있으면 이동이 차단된다.
  - 대각선 앞에 상대 기물이 있을 때만 캡처 이동이 가능하다.

## 📂 2. 대상 아티팩트

- **수정 대상**:
  - `packages/shared/src/engines/pawn-engine.ts`: 폰 이동 로직 구현.
- **테스트 대상**:
  - `packages/shared/src/engines/pawn-engine.spec.ts`: BDD 스타일 테스트 작성.

## 🛠️ 3. 상세 기술 사양

- **공개 함수 시그니처**:
  ```ts
  import { GameState, Square } from '../models/game-state.js';
  export function getPawnMoves(square: Square, state: GameState): Square[];
  ```
- **핵심 조립/흐름 규칙**:
  1. 현재 위치의 기물을 확인하여 색상(COLOR)과 타입(PIECE_TYPE.PAWN)을 판별한다.
  2. 색상에 따른 이동 방향(Offset: White=+8, Black=-8)을 결정한다.
  3. 전진 1칸: 해당 위치가 비어있는지(null) 확인한다.
  4. 전진 2칸: 시작 위치(White=2행, Black=7행)이고 경로가 모두 비어있을 때만 추가한다.
  5. 대각선 캡처: 전진 방향의 좌우 대각선에 상대 색상의 기물이 있는지 확인한다.
- **권장 네이밍**:
  - 내부 변수: `direction`, `forwardOne`, `forwardTwo`, `captures`
  - 상수: `WHITE_START_RANK_START = 8`, `BLACK_START_RANK_START = 48`
- **필수 describe/it 목록**:
  - describe: `getPawnMoves`
  - describe: `흰색 폰(White Pawn)의 이동을 판정할 때`
    - it: `앞에 기물이 없으면 한 칸 전진할 수 있어야 한다`
    - it: `2행(Rank 2)에 위치하고 경로가 비어있으면 두 칸 전진할 수 있어야 한다`
    - it: `대각선에 검은색 기물이 있으면 캡처할 수 있어야 한다`
  - describe: `검은색 폰(Black Pawn)의 이동을 판정할 때`
    - it: `앞에 기물이 없으면 한 칸 전진할 수 있어야 한다`
- **최소 테스트 개수**: 8개 이상 (색상별 전진/캡처/차단 케이스 포함)
- **반드시 포함할 실패 시나리오**:
  - 전진 경로에 자신의 기물이 있는 경우 (이동 불가)
  - 전진 경로에 상대 기물이 있는 경우 (이동 불가)
  - 대각선에 자신의 기물이 있는 경우 (캡처 불가)

## ⚖️ 4. 기술 제약 및 규칙

- **불변성 유지**: `state.board`를 직접 수정하지 않고 읽기 전용으로만 다룹니다.
- **성능 최적화**: `COLOR.WHITE`, `PIECE_TYPE.PAWN` 등 숫자 상수를 직접 비교하여 속도를 높입니다.
- **범위 제한**: 보드 경계(0-63)를 벗어나는 인덱스 계산 시 에러가 발생하지 않도록 방어 로직을 포함합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 배치 전진**
   - Given: `SQUARE.E2`에 백 폰 배치.
   - When: `getPawnMoves` 호출.
   - Then: `[SQUARE.E3, SQUARE.E4]`가 포함되어야 함.

2. **실패 시나리오: 캡처 불가**
   - Given: `SQUARE.D2`에 백 폰, `SQUARE.E3`에 백 폰 배치.
   - When: `getPawnMoves` 호출.
   - Then: `SQUARE.E3`은 결과에 포함되지 않아야 함.

## 🚀 6. 권장 작업 순서

1. `packages/shared/src/engines/pawn-engine.spec.ts`에 BDD 테스트 케이스를 먼저 작성합니다.
2. `pawn-engine.ts`에서 색상 판별 및 방향 결정을 먼저 구현합니다.
3. 1칸/2칸 전진 로직을 구현하고 테스트를 통과시킵니다.
4. 대각선 캡처 로직을 추가하여 나머지 테스트를 통과시킵니다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `pnpm test` 실행 시 모든 폰 이동 관련 테스트가 통과한다.
- [ ] 흰색과 검은색 폰의 방향이 각각 반대로 정확히 적용되었다.
- [ ] 보드 경계에서 발생하는 예외 상황(예: 8행 폰)이 안전하게 처리되었다.

## 💬 9. 추천 커밋 메시지

- `feat: 폰(Pawn) 합법 수 판정 (TASK-004)`
