# 📋 개별 작업 지침서: 승패 및 무승부 판정 (TASK-061)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-060]` (수 실행 로직), `[TASK-010]` (체크 판정)  
**후속 작업**: `[TASK-062]` (SAN 기보 변환)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기물 이동과 상태 전이 로직이 완성되었습니다. 게임이 끝났는지(체크메이트) 혹은 비겼는지(스테일메이트 등)를 판단하는 종합적인 판정 엔진이 필요합니다.
- **이 작업의 책임**: 현재 게임 상태와 과거 이력을 바탕으로 게임의 종료 여부와 결과를 판정합니다.
- **경계 메모**: 3회 동형 반복(Threefold Repetition) 판정을 위해 과거의 모든 FEN 문자열 또는 상태 요약본 배열이 입력으로 필요합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `getGameResult(state, history)` 함수를 통해 현재 게임이 진행 중인지, 한쪽의 승리인지, 혹은 어떤 규칙에 의한 무승부인지를 명확히 식별합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/logic/engine/game-terminator.ts` 생성.
  - 승패 및 무승부 결과 타입을 정의하는 인터페이스 마련.
- **성공 기준 (AC)**:
  - 합법 수가 없고 체크 상태이면 **체크메이트**.
  - 합법 수가 없고 체크가 아니면 **스테일메이트**.
  - `halfmoveClock`이 100에 도달하면 **50수 규칙** 무승부.
  - 동일한 포지션(기물 배치 + 턴 + 캐슬링 + 앙파상)이 3번 반복되면 **3회 동형 반복** 무승부.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/logic/engine/game-terminator.ts`
  - `packages/shared/src/logic/engine/game-terminator.spec.ts`

## 🛠️ 3. 상세 기술 사양

- **핵심 타입 및 함수 시그니처**:

  ```ts
  export type GameResult =
    | { status: 'IN_PROGRESS' }
    | { status: 'CHECKMATE'; winner: Color }
    | { status: 'STALEMATE' }
    | { status: 'DRAW'; reason: '50_MOVES' | 'THREEFOLD_REPETITION' | 'INSUFFICIENT_MATERIAL' };

  export function getGameResult(state: GameState, history: GameState[]): GameResult;
  ```

- **핵심 판정 규칙**:
  1. **합법 수 확인**: 현재 턴 플레이어의 모든 기물에 대해 둘 수 있는 수가 하나라도 있는지 확인.
  2. **종료 조건**: 합법 수가 0일 때 `isCheck` 여부로 메이트/스테일메이트 구분.
  3. **무승부 규칙**:
     - 50수: `state.halfmoveClock >= 100`.
     - 3회 반복: `history` 내에서 현재 `state`와 동일한 '포지션 지문'을 가진 상태가 2개 더 존재하는지 확인.
     - 기물 부족: 킹 대 킹, 킹+비숍 대 킹 등 승리가 불가능한 기물 조합 확인.
- **권장 네이밍**:
  - `getGameResult`: 메인 결과 판정 함수.
  - `isThreefoldRepetition`: 동형 반복 판정 내부 헬퍼.
  - `hasInsufficientMaterial`: 기물 부족 판정 내부 헬퍼.
- **필수 describe/it 목록**:
  - describe: `getGameResult`
    - it: `합법 수가 없고 킹이 위협받고 있으면 체크메이트를 반환해야 한다`
    - it: `합법 수가 없고 킹이 안전하면 스테일메이트를 반환해야 한다`
    - it: `halfmoveClock이 100인 경우 50수 규칙 무승부를 반환해야 한다`
    - it: `동일한 포지션이 3번 나타나면 3회 동형 반복 무승부를 반환해야 한다`
- **반드시 포함할 실패 시나리오**:
  - **동형 반복 오판**: 기물 배치는 같지만 턴이 다르거나 캐슬링 권한이 달라진 경우를 동일 포지션으로 오인하여 무승부 처리하는 상황 방지.

## ⚖️ 4. 기술 제약 및 규칙

- **성능 최적화**: 3회 반복 판정 시 매번 전체 보드를 비교하는 대신, 상태를 요약한 해시(Hash)나 문자열 키를 생성하여 비교할 것을 권장합니다.
- **순수성**: `history` 배열을 변경하지 않고 읽기 전용으로만 사용합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 체크메이트**
   - Given: 피하기 불가능한 퀸/룩 체크 상황.
   - Then: `status === 'CHECKMATE'` 및 승리자 색상 확인.

2. **경계 시나리오: 3회 반복**
   - Given: 킹과 룩이 같은 자리를 3번 왕복하는 수순 이력.
   - Then: `status === 'DRAW', reason === 'THREEFOLD_REPETITION'`.

## ✅ 7. 완료 판정 체크리스트

- [ ] 모든 체스 종료 규칙(메이트, 스테일메이트, 50수, 3회 반복)이 정확히 구현되었다.
- [ ] 각 종료 상황에 대한 단위 테스트가 모두 통과한다.
- [ ] 모든 import에 `.js` 확장자가 포함되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 승패 및 무승부(체크메이트, 50수 등) 판정 로직 구현 (TASK-061)`
