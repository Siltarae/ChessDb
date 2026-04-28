# TASK-019 다시하기

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-019.md)

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 추천 커밋 메시지

- `feat: 다시하기 기능 추가`

## 목적

- 되돌린 수열을 앞으로 다시 진행하는 규칙을 고정한다.
- UI 기준은 `docs/ui/FEATURE-002-board-interaction.svg`의 수순 목록 보조 액션 영역을 따른다.

## 완료 기준

- 되돌린 상태에서 다시 앞으로 진행할 수 있다.
- 다시 진행할 수 없는 상태에서는 다시하기 액션이 비활성화된다.
- 되돌리기 이후 새 수를 두면 이후 수열은 삭제된다.
- Variation 보존은 현재 범위에서 제외되어 있다.

## 관련 메모

- Variation은 [EPIC-998](../epics/EPIC-998.md)에서 다룬다.

## 💬 9. 추천 커밋 메시지

- `chore: update TASK-019.md`
