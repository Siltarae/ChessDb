# 📋 개별 작업 지침서: 폰(Pawn) 합법 수 판정 (TASK-004)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-059]` (GameState)  
**후속 작업**: `[TASK-006]` (비숍 합법 수 판정)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: shared 패키지에는 폰 이동 규칙을 계산하는 엔진의 초안이 필요하며, 다른 기물 로직의 기준점이 되는 첫 이동 엔진 태스크입니다.
- **이 작업의 책임**: 폰의 전진, 첫 두 칸 전진, 대각선 캡처 규칙을 계산하는 이동 엔진과 테스트를 구현합니다.
- **이번 작업에서 하지 않는 것**: 앙파상과 프로모션은 각각 `[TASK-013]`, `[TASK-014]`에서 다룹니다.
- **경계 메모**:
  - 기본 폰 이동 규칙만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 주어진 상태에서 폰이 이동 가능한 칸 배열을 정확히 계산합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/pawn-engine.ts`
  - `packages/shared/src/engines/pawn-engine.spec.ts`
- **성공 기준 (AC)**:
  - 한 칸 전진과 첫 두 칸 전진 규칙을 처리한다.
  - 대각선 캡처를 정확히 계산한다.
  - 아군 기물이 막고 있으면 전진할 수 없다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/engines/pawn-engine.ts`
  - `packages/shared/src/engines/pawn-engine.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts`
- **이번 작업에서 수정하지 않음**:
  - `packages/shared/src/engines/en-passant-engine.ts`
  - `packages/shared/src/engines/promotion-engine.ts`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `getPawnMoves(state, square)` 또는 동일 책임의 함수 시그니처를 고정합니다.
  - 색상에 따라 전진 방향을 다르게 계산합니다.
  - 폰 전진과 캡처 규칙을 분리한 내부 helper를 둘 수 있습니다.
- **데이터 모델 해석**:
  - 입력은 `GameState`, `Square`, 선택한 기물 색상과 보드 셀 상태입니다.
- **외부 의존성**:
  - `vitest`
  - shared 내부 `GameState`, `Square`, `Color` 타입
- **import/export 규칙**:
  - `.js` 확장자를 포함한 상대 import를 유지합니다.
  - shared index export는 구현 완료 후 한 번만 정리합니다.
- **권장 네이밍**:
  - `getPawnMoves`, `forwardStep`, `captureTargets`, `startRank`
- **이름별 사용 의도와 적용 시점**:
  - `forwardStep`은 색상별 한 칸 전진 방향 계산에 사용합니다.
  - `captureTargets`는 대각선 캡처 후보 두 칸을 의미할 때 사용합니다.
- **인수 이름 가이드**:
  - `state`, `square`, `pieceColor`
- **짧은 예시 골격**:

```tsx
const legalMoves = getPawnMoves(state, square);
```

- **필수 describe/it 목록**:
  - `describe('getPawnMoves')`
  - `it('초기 위치에서 한 칸과 두 칸 전진을 반환한다')`
  - `it('대각선 적 기물을 캡처 칸으로 포함한다')`
  - `it('앞이 막혀 있으면 전진 칸을 반환하지 않는다')`
- **최소 테스트 개수**:
  - 최소 4개
- **반드시 포함할 실패 시나리오**:
  - 전진 칸과 캡처 칸을 같은 규칙으로 계산해 앞 대각선 빈 칸을 반환하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 앙파상과 프로모션을 추가하지 않습니다.
- 폰 방향 계산은 색상별로 분기해야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 두 칸 전진**
   - 초기 위치 백 폰
   - 한 칸과 두 칸 전진 반환

2. **정상 시나리오: 대각선 캡처**
   - 적 기물이 대각선 앞에 있음
   - 캡처 칸 포함

3. **실패 시나리오: 막힌 전진**
   - 앞 칸이 차 있음
   - 전진 칸 반환 금지

## 🚀 6. 권장 작업 순서

1. 폰 이동 엔진 테스트를 먼저 작성합니다.
2. 색상별 전진과 캡처 규칙을 구현합니다.
3. shared index export를 연결합니다.
4. 기본/차단/캡처 테스트를 통과시킵니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/shared test`
  - `pnpm --filter @chess-db/shared type-check`

## ✅ 7. 완료 판정 체크리스트

- [ ] 폰 기본 이동 규칙이 구현된다.
- [ ] 차단과 캡처 규칙이 정확하다.
- [ ] 앙파상/프로모션 책임을 넘지 않았다.

## 💬 9. 추천 커밋 메시지

- `feat: 폰 합법 수 판정 엔진을 구현`
