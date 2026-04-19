# 📋 개별 작업 지침서: 기보 결과, 종료 사유 및 대국 날짜 입력 (TASK-026, TASK-027)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-020]` (코멘트 입력)  
**후속 작업**: `[TASK-025]` (정식 저장)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기물 이동과 코멘트 입력은 가능하지만, 게임의 최종 결과(승/패/무)와 대국일 등 필수 메타데이터를 입력할 UI가 없습니다.
- **이 작업의 책임**: 기보 전체의 성격을 규정하는 결과(Result), 종료 사유(Termination), 대국 날짜(PlayedAt)를 입력받아 `GameRecord`의 `metadata` 필드에 저장합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 드롭다운에서 결과를 선택하고 달력에서 날짜를 선택하면, 해당 정보가 기보 메타데이터에 반영됩니다.
- **성공 기준 (AC)**:
  - 결과(`1-0`, `0-1`, `1/2-1/2`, `*`) 중 하나만 선택할 수 있어야 한다.
  - 선택한 날짜는 ISO 8601 문자열 형식으로 변환되어 저장되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/components/notation/GameMetadataForm.tsx`
- **수정 대상**:
  - `apps/web/src/store/useChessStore.ts`: 메타데이터 업데이트 액션 추가.

## 🛠️ 3. 상세 기술 사양

- **데이터 필드**:
  - `result`: `1-0` (백 승), `0-1` (흑 승), `1/2-1/2` (무승부), `*` (진행 중/미정).
  - `termination`: `Checkmate`, `Resignation`, `Timeout`, `Draw Agreement` 등.
  - `playedAt`: `YYYY-MM-DD` 형식의 문자열.
- **UI 컴포넌트**:
  - `shadcn/ui`의 `Select`: 결과 및 종료 사유 선택.
  - `shadcn/ui`의 `Popover` + `Calendar`: 날짜 선택(DatePicker).
- **권장 네이밍**:
  - `updateGameMetadata`: 메타데이터 전체 또는 일부를 수정하는 액션.
  - `RESULT_OPTIONS`, `TERMINATION_OPTIONS`: 상수 배열.

## ✅ 7. 완료 판정 체크리스트

- [ ] 결과와 종료 사유가 상호 배타적으로 정확히 입력된다.
- [ ] 선택한 날짜가 `GameRecord` 상태에 정확히 반영된다.
- [ ] 입력된 데이터가 `GameRecordSchema`의 `metadata` 구조와 일치한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 결과, 종료 사유 및 대국 날짜 입력 기능 구현 (TASK-026, TASK-027)`
