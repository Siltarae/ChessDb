# 📋 개별 작업 지침서: 분석 보드 되돌리기 (TASK-051)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-050]` (직접 수 입력)  
**후속 작업**: `[TASK-052]` (다시하기)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 분석 보드에서 수를 둘 수는 있지만 과거 포지션으로 한 단계 되돌리는 기능이 없습니다.
- **이 작업의 책임**: 분석 보드용 히스토리 포인터를 한 단계 뒤로 이동시키는 규칙과 UI를 구현합니다.
- **이번 작업에서 하지 않는 것**: 분석 보드 다시하기는 `[TASK-052]`에서 다룹니다.
- **경계 메모**:
  - 되돌리기만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 분석 보드에서 이전 포지션으로 되돌아갈 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/analysis-history/model/use-analysis-history.ts`
  - `apps/web/src/widgets/analysis-controls/ui/analysis-controls.tsx`
  - `apps/web/src/pages/analysis-board-page.tsx`
- **성공 기준 (AC)**:
  - 분석 보드에서 되돌리기를 지원한다.
  - 한 단계 이전 포지션으로 이동한다.
  - 첫 포지션에서는 되돌리기가 비활성화된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/analysis-history/model/use-analysis-history.ts`
  - `apps/web/src/widgets/analysis-controls/ui/analysis-controls.tsx`
- **수정 대상**:
  - `apps/web/src/pages/analysis-board-page.tsx`
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/analysis-history/model/use-analysis-history.ts`의 다시하기 분기
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 분석 히스토리 전용 훅이 `canUndo`, `goToPreviousPosition`을 제공합니다.
  - 컨트롤 위젯에 Undo 버튼을 배치합니다.
- **데이터 모델 해석**:
  - analysis history는 입력 보드와 별도인 선형 포지션 배열입니다.
- **외부 의존성**:
  - `react`
- **import/export 규칙**:
  - 분석 보드와 입력 보드의 history 훅을 분리합니다.
- **권장 네이밍**:
  - `useAnalysisHistory`, `goToPreviousPosition`, `canUndo`
- **이름별 사용 의도와 적용 시점**:
  - `goToPreviousPosition`은 분석 보드 맥락을 드러내는 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `currentPositionIndex`
- **짧은 예시 골격**:

```tsx
const { canUndo, goToPreviousPosition } = useAnalysisHistory();
```

- **필수 describe/it 목록**:
  - `describe('useAnalysisHistory undo')`
  - `it('한 단계 이전 포지션으로 이동한다')`
  - `it('첫 포지션에서는 canUndo가 false다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 첫 포지션에서 음수 인덱스로 내려가는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 분석 보드 히스토리는 입력 보드 draft와 독립적이어야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 분석 되돌리기**
   - 여러 수 입력 후 Undo
   - 직전 포지션으로 이동

2. **경계 시나리오: 첫 포지션**
   - 초기 포지션에서 Undo
   - 동작하지 않음

## 🚀 6. 권장 작업 순서

1. 분석 history 훅을 작성합니다.
2. 컨트롤 위젯을 만듭니다.
3. 페이지에 연결합니다.
4. 되돌리기 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 분석 보드 되돌리기가 동작한다.
- [ ] 첫 포지션 보호가 있다.
- [ ] 입력 보드 history와 분리되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드 되돌리기 규칙과 컨트롤을 추가`
