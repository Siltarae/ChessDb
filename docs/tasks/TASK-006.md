# 📋 개별 작업 지침서: 비숍(Bishop) 합법 수 판정 및 슬라이딩 엔진 (TASK-006)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-059]`  
**후속 작업**: `[TASK-007]` (룩 로직)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 폰과 나이트 등 단발성 이동 기물은 준비되었습니다. 장애물을 만나기 전까지 연속해서 이동하는 '슬라이딩' 기물의 공통 로직이 필요한 시점입니다.
- **이 작업의 책임**: 비숍(Bishop)의 대각선 이동을 구현하며, 룩과 퀸이 재사용할 수 있는 **공통 슬라이딩 이동 엔진**을 구축합니다.

- **이번 작업에서 하지 않는 것**: `[TASK-007]` (룩 로직)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 비숍(Bishop) 합법 수 판정 및 슬라이딩 엔진 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: 비숍이 4개 대각선 방향으로 장애물 전까지 이동하거나 상대 기물을 캡처할 수 있는 좌표 배열을 반환합니다.
- **핵심 산출물**: `sliding-engine.ts` (공통), `bishop-engine.ts`.

- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/sliding-engine.ts`
  - `packages/shared/src/engines/bishop-engine.ts`
  - `packages/shared/src/engines/bishop-engine.spec.ts`
- **성공 기준 (AC)**:
  - `getSlidingMoves` 공통 엔진이 룩과 퀸에서도 사용 가능한 구조로 설계되었다.
  - 비숍의 대각선 이동 범위가 정확히 계산된다.
  - 캡처 시 상대 기물 칸이 마지막 결과로 정상 포함된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/engines/sliding-engine.ts`
  - `packages/shared/src/engines/bishop-engine.ts`
  - `packages/shared/src/engines/bishop-engine.spec.ts`
- **수정 대상**:
  - `packages/shared/src/engines/sliding-engine.ts`
  - `packages/shared/src/engines/bishop-engine.ts`
  - `packages/shared/src/engines/bishop-engine.spec.ts`
- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-007]` (룩 로직)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **공통 엔진 시그니처**:
  ```ts
  // sliding-engine.ts
  export function getSlidingMoves(
    square: Square,
    directions: { dx: number; dy: number }[],
    state: GameState,
  ): Square[];
  ```
- **비숍 구현**:
  - 방향 벡터: `[{dx:1, dy:1}, {dx:1, dy:-1}, {dx:-1, dy:1}, {dx:-1, dy:-1}]`
- **핵심 규칙**:
  - 각 방향으로 보드 끝까지 전진하며 빈 칸(`null`)을 수집한다.
  - 아군 기물을 만나면 그 직전에서 멈춘다(아군 칸 불포함).
  - 상대 기물을 만나면 해당 칸을 포함하고 멈춘다(캡처).
- **필수 describe/it 목록**:
  - describe: `getBishopMoves`
    - it: `빈 보드 중앙에서 13개의 대각선 위치를 반환해야 한다`
    - it: `장애물(아군 기물)에 의해 경로가 중간에 차단되어야 한다`
    - it: `상대 기물을 잡을 수 있는 칸까지는 포함하고 그 뒤는 차단되어야 한다`

- **핵심 조립/흐름 규칙**:
  - `getSlidingMoves` 공통 엔진이 룩과 퀸에서도 사용 가능한 구조로 설계되었다.
  - 비숍의 대각선 이동 범위가 정확히 계산된다.
  - 캡처 시 상대 기물 칸이 마지막 결과로 정상 포함된다.

- **데이터 모델 해석**:
  - `GameState.board`와 대각선 방향 벡터가 핵심 입력입니다.
  - 반환값은 현재 비숍이 도달 가능한 `Square[]`이며, 경로 차단과 캡처 종료 규칙을 함께 포함합니다.

- **외부 의존성**:
  - shared 내부 `models/game-state`, `models/square` 타입
  - `vitest`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: 비숍(Bishop) 합법 수 판정 및 슬라이딩 엔진 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `getSlidingMoves`는 룩과 퀸도 재사용할 공통 탐색기일 때 사용합니다.
  - `bishopDirections`는 대각선 4방향 상수 이름으로 고정합니다.

- **인수 이름 가이드**:
  - `square`: 현재 비숍 위치
  - `directions`: 방향 벡터 배열
  - `state`: 현재 보드 스냅샷

- **짧은 예시 골격**:

```ts
const bishopDirections = [
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];
const moves = getSlidingMoves(square, bishopDirections, state);
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - 아군 기물을 만났는데 그 칸을 결과에 포함하는 경우
  - 상대 기물을 캡처한 뒤 같은 방향 탐색을 계속하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-007]` (룩 로직)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - `getSlidingMoves` 공통 엔진이 룩과 퀸에서도 사용 가능한 구조로 설계되었다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - 슬라이딩 경로 차단 규칙이 깨지지 않아야 한다.
   - 캡처 뒤 탐색 종료가 테스트에서 직접 검증되어야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: 비숍(Bishop) 합법 수 판정 및 슬라이딩 엔진 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/shared test`
   - `pnpm --filter @chess-db/shared type-check`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `getSlidingMoves` 공통 엔진이 룩과 퀸에서도 사용 가능한 구조로 설계되었다.
- [ ] 비숍의 대각선 이동 범위가 정확히 계산된다.
- [ ] 캡처 시 상대 기물 칸이 마지막 결과로 정상 포함된다.

## 💬 9. 추천 커밋 메시지

- `feat: 비숍 및 공통 슬라이딩 이동 엔진 구현`
