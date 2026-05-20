# 📋 개별 작업 지침서: 체크(Check) 상태 감지 로직 구현 (TASK-010)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-004]~[TASK-009]` (모든 기물 이동 로직)  
**후속 작업**: `[TASK-011]` (합법 수 필터링)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 각 기물별 이동 가능 칸을 계산하는 개별 제너레이터들이 준비되었습니다. 하지만 특정 위치가 상대에게 위협받고 있는지 판정하는 전역 분석 로직은 없습니다.
- **이 작업의 책임**: 특정 칸의 위협 여부를 판정하는 `isSquareAttacked`와 특정 색상의 킹이 현재 체크 상태인지 확인하는 `isCheck` 함수를 구현합니다.
- **경계 메모**: 본 태스크는 '현재 공격받고 있는가'만 판단합니다. 체크를 해제하기 위해 합법 수를 걸러내는 작업은 다음 태스크(`TASK-011`)의 몫입니다.

- **이번 작업에서 하지 않는 것**: `[TASK-011]` (합법 수 필터링)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: 특정 색상의 킹이 상대 기물에 의해 하나라도 공격받고 있다면 `true`, 아니면 `false`를 반환하는 엔진을 구축합니다.

- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/square-attack-engine.ts`
  - `packages/shared/src/engines/square-attack-engine.spec.ts`
  - `packages/shared/src/engines/check-engine.ts`
  - `packages/shared/src/engines/check-engine.spec.ts`
- **성공 기준 (AC)**:
  - `isSquareAttacked`가 모든 종류의 기물 위협을 정확히 판별한다.
  - 킹의 위치를 자동으로 찾아 체크 여부를 반환하는 `isCheck`가 구현되었다.
  - 성능 최적화를 위해 역추적(Reverse Lookup) 방식이 적용되었다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/engines/square-attack-engine.ts`
  - `packages/shared/src/engines/square-attack-engine.spec.ts`
  - `packages/shared/src/engines/check-engine.ts`
  - `packages/shared/src/engines/check-engine.spec.ts`
- **수정 대상**:
  - `packages/shared/src/engines/square-attack-engine.ts`
  - `packages/shared/src/engines/square-attack-engine.spec.ts`
  - `packages/shared/src/engines/check-engine.ts`
  - `packages/shared/src/engines/check-engine.spec.ts`
- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-011]` (합법 수 필터링)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **구현 방식 (Reverse Lookup 권장)**:
  - 성능을 위해 대상 칸(Square)에서 각 기물의 공격 방향으로 '역추적'하여 공격자를 찾습니다.
  - 예: 대상 칸에서 직선 방향으로 탐색했을 때 상대 룩/퀸이 가장 먼저 나타나는가?
- **공개 함수 시그니처**:
  ```ts
  export function isSquareAttacked(square: Square, attackerColor: Color, state: GameState): boolean;
  export function isCheck(state: GameState, color: Color): boolean;
  ```
- **필수 describe/it 목록**:
  - describe: `isSquareAttacked`
    - it: `상대 룩이 같은 파일에서 막히지 않으면 공격 중으로 판정해야 한다`
    - it: `슬라이딩 공격 경로에 장애물이 있으면 공격이 아닌 것으로 판정해야 한다`
    - it: `나이트, 폰, 킹의 비슬라이딩 공격도 정확히 감지해야 한다`
  - describe: `isCheck`
    - it: `킹이 상대 룩의 공격 경로에 있을 때 체크 상태임을 감지해야 한다`
    - it: `중간에 장애물(아군/상대 기물)이 공격 경로를 막고 있으면 체크가 아님을 반환해야 한다`
    - it: `킹이 나이트에 의해 위협받는 상황을 정확히 감지해야 한다`
    - it: `킹이 폰에 의해 대각선 공격을 받는 상황을 정확히 감지해야 한다`

- **핵심 조립/흐름 규칙**:
  - `isSquareAttacked`가 모든 종류의 기물 위협을 정확히 판별한다.
  - 킹의 위치를 자동으로 찾아 체크 여부를 반환하는 `isCheck`가 구현되었다.
  - 성능 최적화를 위해 역추적(Reverse Lookup) 방식이 적용되었다.

- **데이터 모델 해석**:
  - 입력은 현재 `GameState`, 대상 `Square`, 공격자 `Color`입니다.
  - 출력은 특정 칸이 공격받는지와 특정 색 킹이 체크인지 여부입니다.

- **외부 의존성**:
  - shared 내부 각 기물 이동 엔진
  - `vitest`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: 체크(Check) 상태 감지 로직 구현 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `isSquareAttacked`는 특정 칸 위협 판정 전용 함수로 사용합니다.
  - `isCheck`는 킹 위치 탐색과 위협 판정을 묶는 최상위 API입니다.

- **인수 이름 가이드**:
  - `state`, `square`, `attackerColor`, `color`

- **짧은 예시 골격**:

```ts
const inCheck = isCheck(state, color);
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - 나이트/폰처럼 비슬라이딩 공격 규칙을 빠뜨리는 경우
  - 장애물이 있는데도 슬라이딩 공격을 통과시키는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-011]` (합법 수 필터링)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - `isSquareAttacked`가 모든 종류의 기물 위협을 정확히 판별한다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - 모든 공격 패턴이 판정 대상에 포함되어야 한다.
   - 장애물에 의한 차단이 체크 판정에 반영되어야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: 체크(Check) 상태 감지 로직 구현 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/shared test`
   - `pnpm --filter @chess-db/shared type-check`
   - `pnpm --filter @chess-db/shared test:coverage`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `isSquareAttacked`가 모든 종류의 기물 위협을 정확히 판별한다.
- [ ] 킹의 위치를 자동으로 찾아 체크 여부를 반환하는 `isCheck`가 구현되었다.
- [ ] 성능 최적화를 위해 역추적(Reverse Lookup) 방식이 적용되었다.

## 💬 9. 추천 커밋 메시지

- `feat: 체크(Check) 상태 및 특정 칸 위협 감지 로직 구현`
