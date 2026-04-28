# TASK-062 기물 이동의 SAN(Standard Algebraic Notation) 표기 변환 로직

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-062.md)

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 추천 커밋 메시지

- `feat: 착수 결과를 SAN 표기법으로 변환하는 로직 추가`

## 목적

- 화면에 표시될 수순 목록과 저장될 기보 데이터를 위해 착수(출발 칸 -> 도착 칸)를 체스 표준 기보법(SAN) 문자열로 변환한다.
- `FEATURE-002` 화면에서는 `docs/ui/FEATURE-002-board-interaction.svg`의 SAN 탭과 최근 SAN 표시 영역에서 이 값을 소비한다.

## 완료 기준

- 기물 이동(예: `Nf3`, `e4`)을 정확한 문자열로 생성해야 한다.
- 기물 포획(예: `exd5`, `Bxf7`), 캐슬링(`O-O`, `O-O-O`), 프로모션(`e8=Q`), 체크(`+`) 및 체크메이트(`#`) 기호를 올바르게 반영해야 한다.
- 동일한 기물 두 개가 같은 칸으로 이동할 수 있을 때, 기물 구분을 위한 파일(file) 또는 랭크(rank) 정보(예: `Nbd7`)를 정확히 포함해야 한다.

## 💬 9. 추천 커밋 메시지

- `chore: update TASK-062.md`
