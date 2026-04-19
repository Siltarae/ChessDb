# 📋 개별 작업 지침서: 반수별 코멘트 및 착수 평가 기호 입력 (TASK-020)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-001]`, `[TASK-063]` (GameRecord 스키마)  
**후속 작업**: `[TASK-022]`  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 수순 목록과 보드 레이아웃은 준비되었으나, 특정 수(Move)에 대한 사용자의 의견이나 평가를 기록할 UI와 상태가 없습니다.
- **이 작업의 책임**: 수순 목록에서 현재 선택된 수에 대해 텍스트 코멘트와 표준 착수 평가 기호(!!, ?, !? 등)를 입력할 수 있는 UI와 상태 업데이트 로직을 구현합니다.
- **경계 메모**: 코멘트는 개별 `MoveHistoryItem` 내에 저장되며, 전역 `GameRecord` 상태의 일부로 관리됩니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 특정 수를 클릭하고 코멘트 창에 글을 쓰거나 버튼을 눌러 평가 기호를 붙이면, 해당 데이터가 현재 기보 상태에 즉시 반영됩니다.
- **성공 기준 (AC)**:
  - 각 반수(Ply)는 독립적인 코멘트와 평가 기호를 가질 수 있어야 한다.
  - 입력된 데이터는 Zustand 스토어의 `history` 배열 내 해당 아이템의 `comment` 필드에 정확히 매핑되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/components/notation/CommentEditor.tsx`
  - `apps/web/src/components/notation/AnnotationPicker.tsx`
- **수정 대상**:
  - `apps/web/src/store/useChessStore.ts`: 코멘트 업데이트 액션 추가.

## 🛠️ 3. 상세 기술 사양

- **데이터 모델 해석**:
  - `MoveHistoryItem`: `{ move: Move, san: string, comment?: string }`
  - 코멘트 입력 시 해당 인덱스의 `comment` 필드를 업데이트합니다.
- **UI 컴포넌트**:
  - `CommentEditor`: `shadcn/ui`의 `Textarea`를 활용한 멀티라인 입력기.
  - `AnnotationPicker`: `ToggleGroup`을 사용하여 !!, !, !?, ?!, ?, ?? 기호 중 하나를 선택.
- **권장 네이밍**:
  - `updateMoveComment`: 특정 수의 코멘트를 수정하는 액션.
  - `selectedMoveIndex`: 현재 에디터가 가리키고 있는 수의 인덱스.
- **필수 describe/it 목록**:
  - describe: `CommentEditor`
    - it: `텍스트 입력 시 해당 수의 코멘트 상태가 실시간으로 변경되어야 한다`
    - it: `수순 목록에서 선택된 수가 바뀌면 에디터의 내용도 해당 수의 코멘트로 전환되어야 한다`

## ⚖️ 4. 기술 제약 및 규칙

- **불변성**: `history` 배열의 특정 요소를 수정할 때 반드시 전개 연산자를 사용하여 새로운 배열을 생성합니다.
- **Fail-Fast**: 빈 코멘트는 `undefined` 또는 공백 제거 후 빈 문자열로 처리하여 저장 용량을 최적화합니다.

## ✅ 7. 완료 판정 체크리스트

- [ ] 수순 목록의 특정 수를 선택했을 때 해당 수에 저장된 코멘트가 정상 노출된다.
- [ ] 텍스트 입력 및 버튼 클릭 시 Zustand 상태가 즉시 업데이트된다.
- [ ] `GameRecordSchema`를 통한 유효성 검증을 통과하는 형식으로 저장된다.

## 💬 9. 추천 커밋 메시지

- `feat: 반수별 코멘트 및 착수 평가 기호 입력 기능 구현 (TASK-020)`
