# TASK-016 합법 수 착수와 보드 갱신

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-016.md)

## 상위 Feature

- [FEATURE-002 기보 입력 보드 상호작용 및 수순 관리](../features/FEATURE-002.md)

## 상태

- 2026-04-30 기준 완료로 판정한다.
- 구현 커밋: `9d6f2f4 feat: 클릭 기반 기물 이동 및 게임 상태 업데이트 구현`

## 추천 커밋 메시지

- `feat: 합법 수 착수와 보드 갱신 추가`

## 목적

- 합법 수를 실제로 둘 때 보드 상태를 어떻게 갱신하는지 고정한다.
- UI 기준은 `docs/ui/FEATURE-002-board-interaction.svg`의 마지막 수 표시와 선택 해제 흐름을 따른다.

## 완료 기준

- [x] 사용자가 합법 수를 선택하면 보드 상태가 갱신된다.
- [x] 캡처와 특수 이동 결과가 보드에 반영된다.
- [x] 착수 완료 후 선택 상태와 합법 수 하이라이트는 정리된다.
- [x] 마지막 착수는 보드에서 이전/도착 칸이 구분되도록 표시된다.
- [x] 턴 전환과 수순 기록의 시작점이 된다.

## 완료 판정 기록

- `pnpm --filter @chess-db/web test` 통과
- `pnpm --filter @chess-db/web test:coverage` 통과
- `pnpm --filter @chess-db/web lint` 통과
- `pnpm --filter @chess-db/web format:check` 통과
- `pnpm --filter @chess-db/web build` 통과

## 관련 메모

- 수순 표기 세부 포맷은 별도 Task와 연결된다.
- E2E 환경 구성과 브라우저 수준 스모크 검증은 `TASK-016` 완료 판정에 포함하지 않고 `TASK-099`, `TASK-100`에서 별도로 다룬다.

## 💬 9. 추천 커밋 메시지

- `feat: 클릭 기반 기물 이동 및 게임 상태 업데이트 구현`
