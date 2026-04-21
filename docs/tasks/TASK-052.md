# 📋 개별 작업 지침서: 분석 보드 다시하기 (TASK-052)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-051]` (분석 보드 되돌리기)  
**후속 작업**: `[TASK-054]` (통계 집계 대상 확정)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 분석 보드에서 되돌릴 수는 있지만 앞으로 다시 진행하거나 되돌린 뒤 새 수를 두었을 때 미래 포지션을 정리하는 규칙이 없습니다.
- **이 작업의 책임**: 분석 보드의 다시하기와 미래 포지션 삭제 규칙을 구현합니다.
- **이번 작업에서 하지 않는 것**: Variation 보존은 현재 범위에서 다루지 않습니다.
- **경계 메모**:
  - 선형 분석 히스토리만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 분석 보드에서도 되돌린 포지션을 다시 진행할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/analysis-history/model/use-analysis-history.ts`
  - `apps/web/src/widgets/analysis-controls/ui/analysis-controls.tsx`
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
- **성공 기준 (AC)**:
  - 분석 보드에서도 다시하기를 지원한다.
  - 되돌리기 이후 새 수를 두면 이후 수열은 삭제된다.
  - Variation 보존은 현재 범위에서 제외되어 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/features/analysis-history/model/use-analysis-history.ts`
  - `apps/web/src/widgets/analysis-controls/ui/analysis-controls.tsx`
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
- **이번 작업에서 수정하지 않음**:
  - variation 관련 구조 전체
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-analysis-history`에 `canRedo`, `goToNextPosition`, `truncateFuturePositions`를 추가합니다.
  - 새 수 입력 시 미래 포지션을 먼저 정리합니다.
- **데이터 모델 해석**:
  - 분석 포지션 히스토리는 선형 배열입니다.
- **외부 의존성**:
  - `react`
- **import/export 규칙**:
  - 미래 포지션 삭제는 입력 훅이 아니라 analysis history 훅 또는 model layer에서 담당합니다.
- **권장 네이밍**:
  - `goToNextPosition`, `canRedo`, `truncateFuturePositions`
- **이름별 사용 의도와 적용 시점**:
  - `truncateFuturePositions`는 되돌린 뒤 새 수를 둘 때만 사용합니다.
- **인수 이름 가이드**:
  - `nextPositionIndex`
- **짧은 예시 골격**:

```tsx
if (canRedo) goToNextPosition();
```

- **필수 describe/it 목록**:
  - `describe('analysis redo')`
  - `it('다시하기가 다음 포지션으로 이동한다')`
  - `it('되돌린 뒤 새 수를 두면 미래 포지션을 삭제한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 미래 포지션이 남은 상태로 새 수가 append되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- Variation 보존은 포함하지 않습니다.
- 분석 보드 히스토리는 선형으로 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 다시하기**
   - 되돌린 뒤 Redo
   - 다음 포지션 복구

2. **정상 시나리오: 미래 포지션 삭제**
   - 과거 상태에서 새 수 입력
   - 이후 포지션 삭제

3. **실패 시나리오: 분기 잔존**
   - 새 수 뒤에 예전 미래 포지션이 남음
   - 히스토리 길이 테스트 실패

## 🚀 6. 권장 작업 순서

1. 분석 history 훅에 redo와 truncate를 추가합니다.
2. 컨트롤 UI를 갱신합니다.
3. 새 수 입력 로직과 연결합니다.
4. redo/미래 삭제 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 분석 보드 다시하기가 동작한다.
- [ ] 미래 포지션 삭제 규칙이 있다.
- [ ] Variation을 도입하지 않았다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드 다시하기와 미래 포지션 삭제를 추가 (TASK-052)`
