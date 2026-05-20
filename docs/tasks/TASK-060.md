# 📋 개별 작업 지침서: 수 실행 및 상태 업데이트 (TASK-060)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-011]` (합법 수 필터링), `[TASK-012]`~`[TASK-014]`  
**후속 작업**: `[TASK-061]` (승패 판정)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 개별 이동 엔진은 준비되었지만 실제 수를 적용해 `GameState`를 다음 상태로 전이시키는 공통 엔진은 없습니다.
- **이 작업의 책임**: 착수 정보를 바탕으로 보드, 턴, 캐슬링 권리, 앙파상 타깃, halfmove/fullmove 카운터를 갱신한 새 `GameState`를 반환합니다.
- **이번 작업에서 하지 않는 것**: 종료 판정과 SAN 문자열 생성은 후속 태스크로 남깁니다.
- **경계 메모**:
  - 상태 전이 자체만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: `executeMove(state, move)`가 불변성을 유지한 새 게임 상태를 반환합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/move-executor.ts`
  - `packages/shared/src/engines/move-executor.spec.ts`
  - `packages/shared/src/index.ts`
- **성공 기준 (AC)**:
  - 원본 `state`를 직접 수정하지 않는다.
  - 폰 이동/캡처 시 `halfmoveClock`이 0으로 초기화된다.
  - 킹·룩 이동과 폰 2칸 전진에 따른 보조 상태가 정확히 갱신된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/engines/move-executor.ts`
  - `packages/shared/src/engines/move-executor.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts`
- **이번 작업에서 수정하지 않음**:
  - `packages/shared/src/engines/game-result-engine.ts`
  - `packages/shared/src/notation/san-converter.ts`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `Move` 타입과 `executeMove` 함수 시그니처를 고정합니다.
  - 캐슬링 권리, 앙파상 타깃, 수 카운터를 별도 helper로 분리할 수 있습니다.
  - 프로모션/앙파상/캐슬링 특수 수는 선행 엔진 결과를 바탕으로 적용합니다.
- **데이터 모델 해석**:
  - 입력은 현재 `GameState`와 실행할 `Move`입니다. 출력은 다음 상태 하나입니다.
- **외부 의존성**:
  - shared 내부 `GameState`, `Move`, `PieceType` 타입
  - `vitest`
- **import/export 규칙**:
  - `.js` 확장자를 포함한 named export 규칙을 유지합니다.
  - 상태 전이 helper는 `engines/` 아래에 둡니다.
- **권장 네이밍**:
  - `executeMove`, `updateCastlingRights`, `computeEnPassantTarget`, `nextHalfmoveClock`
- **이름별 사용 의도와 적용 시점**:
  - `updateCastlingRights`는 킹·룩 이동과 캡처에 따른 권리 갱신을 담당할 때 사용합니다.
  - `computeEnPassantTarget`은 폰 2칸 전진 후 타깃 칸 계산에 사용합니다.
- **인수 이름 가이드**:
  - `state`, `move`, `movingPiece`, `capturedPiece`
- **짧은 예시 골격**:

```tsx
const nextState = executeMove(state, move);
```

- **필수 describe/it 목록**:
  - `describe('executeMove')`
  - `it('일반 이동 후 턴과 보드 상태를 갱신한다')`
  - `it('폰 이동 시 halfmoveClock을 0으로 만든다')`
  - `it('킹 이동 시 캐슬링 권리를 제거한다')`
  - `it('원본 상태를 수정하지 않는다')`
- **최소 테스트 개수**:
  - 최소 5개
- **반드시 포함할 실패 시나리오**:
  - 원본 `state.board`를 직접 수정하는 경우
  - 특수 수 이후 보조 상태를 갱신하지 않는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 상태 전이는 항상 새 객체를 반환해야 합니다.
- 종료 판정이나 SAN 생성 로직을 섞지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 일반 이동**
   - 합법 수 하나 실행
   - 보드와 턴이 다음 상태로 갱신

2. **정상 시나리오: 폰 2칸 전진**
   - 초기 위치 폰을 두 칸 전진
   - 앙파상 타깃이 설정

3. **실패 시나리오: 원본 오염**
   - 원본 상태 참조가 바뀜
   - 불변성 테스트 실패

## 🚀 6. 권장 작업 순서

1. 상태 전이 테스트를 먼저 작성합니다.
2. 보드/턴/보조 상태 갱신 로직을 구현합니다.
3. shared index export를 연결합니다.
4. 불변성과 특수 수 테스트를 통과시킵니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/shared test`
  - `pnpm --filter @chess-db/shared type-check`

## ✅ 7. 완료 판정 체크리스트

- [ ] 새 `GameState`를 반환한다.
- [ ] 보조 상태가 정확히 갱신된다.
- [ ] 원본 상태 불변성이 유지된다.

## 💬 9. 추천 커밋 메시지

- `feat: 수 실행 및 게임 상태 전이 엔진을 구현`
