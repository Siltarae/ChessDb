# FEATURE-002 기보 입력 보드 상호작용 및 수순 관리

## 상위 Epic

- [EPIC-001 학습용 기보 저장 및 분석](../epics/EPIC-001.md)

## 브랜치명

- `feature/FEATURE-002-보드-상호작용`

## 목적

- 사용자가 보드 UI를 통해 체스 기물을 선택하고 착수하며, 수순을 되돌리거나 다시하는 상호작용을 지원한다.

## 동작 개요

- 기보 입력은 새 게임 시작 포지션에서만 시작한다.
- 화면 구조는 `docs/ui/FEATURE-002-board-interaction.svg`를 Feature 기준안으로 삼고, `TASK-001`과 `TASK-002`는 각각 `docs/ui/TASK-001-board-centered.svg`, `docs/ui/TASK-002-standard-start-board.svg`를 직접 기준으로 삼는다.
- 사용자가 기물을 클릭했을 때 해당 기물의 합법 수를 보드에 하이라이트로 표시한다.
- 합법 수 위치를 클릭하면 실제 착수가 이루어지고 보드 상태와 현재 턴이 갱신된다.
- 착수된 수는 체스 표준 기보법(SAN)으로 변환되어 수순 목록에 순차적으로 기록 및 표시된다.
- 사용자는 되돌리기와 다시하기를 통해 이전 수순으로 돌아갈 수 있다.
- 되돌리기 이후 새로운 수를 두면 기존의 이후 수열은 삭제된다.
- 수순 목록은 백/흑을 한 행에 나누는 2열 구조를 기본으로 하고, 첫 착수 전에는 목록을 숨기거나 축약 안내만 표시한다.
- `FEATURE-002`에서 우측 보조 영역은 SAN 확인과 수순 조작까지만 다루며, 코멘트/평가/기보 정보의 실제 입력과 저장은 `FEATURE-003`에서 다룬다.

## 하위 Task

- [TASK-083 apps/web React + Vite 프로젝트 초기화 및 기본 환경 구성](../tasks/TASK-083.md)
- [TASK-084 apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동](../tasks/TASK-084.md)
- [TASK-085 apps/web 필수 공통 라이브러리(Zustand, Query 등) 의존성 추가](../tasks/TASK-085.md)
- [TASK-092 apps/web Vitest 및 React Testing Library 환경 구성](../tasks/TASK-092.md)
- [TASK-001 기보 입력 뷰 기본 화면 구성](../tasks/TASK-001.md)
- [TASK-002 표준 시작 포지션 보드 표시](../tasks/TASK-002.md)
- [TASK-003 현재 턴 초기화와 전환 규칙](../tasks/TASK-003.md)
- [TASK-015 선택 기물 합법 수 하이라이트](../tasks/TASK-015.md)
- [TASK-016 합법 수 착수와 보드 갱신](../tasks/TASK-016.md)
- [TASK-099 apps/web Playwright E2E 환경 구성](../tasks/TASK-099.md)
- [TASK-100 기보 입력 핵심 흐름 E2E 스모크 테스트](../tasks/TASK-100.md)
- [TASK-096 프로모션 기물 선택 UI](../tasks/TASK-096.md)
- [TASK-098 체크 상태 표시](../tasks/TASK-098.md)
- [TASK-097 착수 후 게임 종료 상태 감지 및 표시](../tasks/TASK-097.md)
- [TASK-062 기물 이동의 SAN(Standard Algebraic Notation) 표기 변환 로직](../tasks/TASK-062.md)
- [TASK-017 수순 목록 기록](../tasks/TASK-017.md)
- [TASK-018 되돌리기](../tasks/TASK-018.md)
- [TASK-019 다시하기](../tasks/TASK-019.md)

## 메모

- 체스 도메인 로직(FEATURE-001)을 바탕으로 UI 렌더링 및 사용자 이벤트 처리에 집중한다.
- 보드 기준 크기는 데스크탑에서 640px 정사각형을 우선 기준으로 삼되, 반응형 축소 시 정사각형 비율을 유지한다.
- 프로모션 선택, 체크 상태, 게임 종료 상태처럼 화면 상태가 필요한 Task는 구현 전에 `docs/ui/TASK-xxx-*.svg` 스케치를 먼저 작성하고 합의한다.
- `TASK-016` 완료 기준에는 E2E를 포함하지 않고, 브라우저 수준 검증은 `TASK-099`, `TASK-100`에서 별도 Task로 다룬다.
