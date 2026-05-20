# 📋 개별 작업 지침서: 다시하기 (TASK-019)

**작업 상태**: 완료
**선행 작업**: `[TASK-018]` (되돌리기)
**후속 작업**: `FEATURE-002` 완료
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-002-board-interaction.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 다시하기로 이후 반수 시점으로 이동할 수 있고, 새 수를 두면 포인터 뒤의 미래 반수를 정리하는 선형 히스토리 규칙이 구현되어 있습니다.
- **이 작업의 책임**: 현재 포인터를 이후 반수로 이동시키고, 되돌린 뒤 새 수를 두는 경우 포인터 뒤의 미래 수열을 삭제하는 규칙을 고정합니다.
- **이번 작업에서 하지 않는 것**: Variation 보존이나 여러 갈래 수순 분기는 현재 범위에서 다루지 않습니다.
- **경계 메모**:
  - 이 문서는 단일 선형 히스토리만 지원합니다. 갈래(branch) 보존은 후순위 범위입니다.
  - 다시하기 액션은 우측 수순 목록 보조 액션 영역에 배치하고, 다음 반수가 없으면 비활성화한다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 다시하기 버튼을 누르면 다음 반수 시점으로 복귀하고, 되돌린 뒤 새 수를 두면 기존 미래 수열이 자동으로 잘립니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/history-navigation/model/use-history-navigation.ts`
  - `apps/web/src/widgets/notation-controls/ui/history-controls.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/features/make-move/model/use-make-move.ts`
- **성공 기준 (AC)**:
  - 되돌린 상태에서 다시하기 버튼이 다음 반수가 있을 때만 활성화된다.
  - 다시하기 실행 시 보드 상태와 선택된 수순 인덱스가 미래 반수로 함께 이동한다.
  - 과거 시점에서 새 수를 두면 미래 반수 배열이 잘리고 새 선형 히스토리로 대체된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/history-navigation/model/use-history-navigation.ts`의 다시하기 분기
- **수정 대상**:
  - `apps/web/src/widgets/notation-controls/ui/history-controls.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/features/make-move/model/use-make-move.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/entities/game/model/variation-store.ts` 같은 분기 수순 구조
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-store`에 `goToNextPly`, `canRedo`, `truncateFutureHistory`를 추가합니다.
  - `use-make-move`는 현재 포인터가 마지막 반수가 아니면 `truncateFutureHistory`를 먼저 실행한 뒤 새 수를 append합니다.
  - `history-controls.tsx`에 Redo 버튼과 키보드 단축키를 연결합니다.
- **데이터 모델 해석**:
  - `history.length - 1`이 현재 선형 수열의 마지막 반수입니다.
  - `currentPlyIndex < history.length - 1`이면 다시하기 가능 상태로 해석합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@chess-db/shared`의 반수 상태 타입
- **import/export 규칙**:
  - `use-make-move`는 미래 수열 삭제를 위해 store 액션만 호출하고, UI에서 배열을 직접 자르지 않습니다.
  - `history-controls.tsx`는 `useHistoryNavigation`이 노출한 `canRedo`, `goToNextPly`만 사용합니다.
- **권장 네이밍**:
  - `goToNextPly`, `canRedo`, `truncateFutureHistory`
  - `nextPlyIndex`, `futureMoves`, `hasFutureHistory`
- **이름별 사용 의도와 적용 시점**:
  - `truncateFutureHistory`는 되돌린 뒤 새 수를 둘 때만 호출합니다.
  - `goToNextPly`는 다시하기 버튼과 키보드 단축키가 호출하는 store 액션 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `currentPlyIndex`: 현재 기준 시점을 나타내는 인수 이름으로 유지합니다.
  - `nextState`: 잘라낸 뒤 추가할 새 반수 스냅샷을 의미할 때 사용합니다.
- **짧은 예시 골격**:

```tsx
if (currentPlyIndex < history.length - 1) {
  truncateFutureHistory();
}
appendMove(nextState);
```

- **필수 describe/it 목록**:
  - `describe('redo and truncate')`
  - `it('다음 반수가 있을 때만 canRedo가 true다')`
  - `it('goToNextPly 호출 시 다음 반수 스냅샷으로 이동한다')`
  - `it('과거 시점에서 새 수를 두면 이후 수열이 삭제된다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 다시하기 후에도 선택된 수순 인덱스가 이전 값을 유지하는 경우
  - 미래 수열을 자르지 않고 새 수를 append해서 히스토리가 꼬이는 경우

## ⚖️ 4. 기술 제약 및 규칙

- Variation 보존 로직을 도입하지 않습니다.
- 다시하기와 미래 수열 삭제는 같은 store 규칙을 공유해야 합니다.
- 히스토리 배열을 자를 때도 기존 객체를 직접 mutate하지 않습니다.
- 키보드 단축키는 입력 필드 포커스 중에는 실행되지 않도록 막습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 다시 앞으로 이동**
   - 두 반수 되돌린 뒤 `goToNextPly`를 호출한다.
   - 다음 반수 시점의 보드와 선택 상태가 함께 복구된다.

2. **정상 시나리오: 미래 수열 삭제**
   - 과거 시점에서 다른 새 수를 둔다.
   - 기존 미래 반수는 삭제되고 새 수열만 남는다.

3. **실패 시나리오: 분기 수열 잔존**
   - 미래 수열이 남은 상태에서 새 수를 append한다.
   - 히스토리 길이와 표시 수순이 어긋나는 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. `game-store.ts`에 `goToNextPly`, `canRedo`, `truncateFutureHistory`를 추가합니다.
2. `use-make-move.ts`에서 새 수 입력 전에 미래 수열 정리 규칙을 호출합니다.
3. `history-controls.tsx`에 Redo 버튼, 키보드 단축키, disabled 조건을 연결합니다.
4. 되돌리기/다시하기/새 수 입력이 한 스토어 규칙으로 맞물리는지 테스트합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 다시하기가 다음 반수가 있을 때만 동작한다.
- [ ] 되돌린 뒤 새 수를 두면 미래 수열이 삭제된다.
- [ ] 선형 히스토리 규칙이 UI와 store 모두에서 일치한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 입력 다시하기와 미래 수열 삭제 규칙을 추가`
