# 📋 개별 작업 지침서: 현재 턴 초기화와 전환 규칙 (TASK-003)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-059]` (GameState), `[TASK-016]` (착수와 보드 갱신)  
**후속 작업**: `[TASK-017]` (수순 기록)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 보드 렌더링은 가능할 수 있지만, 현재 턴을 어떤 상태로 초기화하고 착수 뒤 어떻게 전환할지 UI/store 기준이 명확하지 않습니다.
- **이 작업의 책임**: 현재 턴 상태를 초기화하고 착수 이후 흑/백 턴 전환 규칙을 store에 반영합니다.
- **이번 작업에서 하지 않는 것**: 승패 판정과 종료 상태 고정은 후속 태스크에서 처리합니다.
- **경계 메모**:
  - 턴 상태와 표시만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 기보 입력 화면에서 현재 턴이 명확히 표시되고, 수를 둘 때마다 올바르게 전환됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/widgets/notation-status/ui/current-turn-indicator.tsx`
  - `apps/web/src/pages/notation-input-page.tsx`
- **성공 기준 (AC)**:
  - 초기 턴은 백으로 시작한다.
  - 합법 수 착수 뒤 턴이 반대 색으로 전환된다.
  - 현재 턴 표시 UI가 store 상태와 동일하다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/notation-status/ui/current-turn-indicator.tsx`
- **수정 대상**:
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/move-history/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-store`에 `currentTurn` selector를 노출합니다.
  - 착수 액션 완료 시 shared engine 상태의 `turn`을 그대로 사용합니다.
  - `current-turn-indicator.tsx`는 현재 턴만 표시합니다.
- **데이터 모델 해석**:
  - 턴 상태는 `white | black` 두 값만 가집니다.
- **외부 의존성**:
  - `zustand`
  - `@chess-db/shared` `Color` 타입
- **import/export 규칙**:
  - 턴 표시 위젯은 store selector만 읽고 직접 전환 로직을 만들지 않습니다.
- **권장 네이밍**:
  - `currentTurn`, `CurrentTurnIndicator`, `applyMoveResult`
- **이름별 사용 의도와 적용 시점**:
  - `currentTurn`은 화면 표시와 조건 분기의 공통 기준입니다.
- **인수 이름 가이드**:
  - `nextTurn`, `currentTurn`
- **짧은 예시 골격**:

```tsx
const currentTurn = useGameStore((state) => state.currentTurn);
```

- **필수 describe/it 목록**:
  - `describe('current turn state')`
  - `it('초기 턴이 white다')`
  - `it('수 실행 뒤 턴이 반대로 전환된다')`
  - `it('표시 위젯이 현재 턴과 같은 값을 보여준다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 보드 상태는 바뀌었는데 현재 턴 표시만 갱신되지 않는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 턴 계산을 UI에서 중복 구현하지 않습니다.
- 종료 상태나 체크 표시를 함께 붙이지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 턴 표시**
   - 페이지 첫 렌더
   - 백 턴 표시

2. **정상 시나리오: 착수 후 전환**
   - 한 수 실행
   - 흑 턴 표시로 변경

3. **실패 시나리오: UI-store 불일치**
   - store turn과 indicator 텍스트가 다름
   - 표시 테스트 실패

## 🚀 6. 권장 작업 순서

1. store에 currentTurn selector를 정리합니다.
2. 턴 표시 위젯을 만듭니다.
3. 페이지에 연결합니다.
4. 초기/전환/표시 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 초기 턴이 백이다.
- [ ] 수 뒤 턴이 전환된다.
- [ ] 표시 UI가 store와 일치한다.

## 💬 9. 추천 커밋 메시지

- `feat: 현재 턴 초기화와 전환 규칙을 추가 (TASK-003)`
