# FEATURE-003 정식 기보 영속 ERD

## 목적

- `FEATURE-003`에서 정식 저장된 기보를 저장하기 위한 최소 영속 모델을 정의한다.
- 당장 필요한 `Game`, `GameMove` 관계와 필드만 고정한다.
- 후속 Feature에서 실제 요구가 생기면 Prisma migration으로 확장한다.

## 관련 산출물

- dbdiagram 원본: `docs/architecture/erd/dbdiagram/erd.dbml`
- dbdiagram export SVG: `docs/architecture/erd/dbdiagram/erd.svg`

## 범위

### 포함

- 정식 저장된 기보 1건을 표현하는 `Game`
- 정식 저장된 기보의 반수별 수순을 표현하는 `GameMove`
- `Game` 1개가 여러 `GameMove`를 가지는 1:N 관계
- 결과, 종료 사유, 착수 평가 기호의 문자열 enum 저장 방침

### 제외

- 브라우저 초안 저장 구조
- 저장소 선택/생성/삭제 모델
- 기보 삭제 및 soft delete
- 비표준 시작 포지션
- 반수별 `GameState` 스냅샷
- 별도 코드 테이블

## ERD 요약

```text
Game 1 ── N GameMove
```

## Game

정식 저장된 한 판 전체에 붙는 정보다.

| 필드                | 타입                    | 필수   | 설명                            |
| ------------------- | ----------------------- | ------ | ------------------------------- |
| `id`                | `uuid`                  | 예     | 기보 고유 ID                    |
| `result`            | `GameResult`            | 예     | 기보 결과 상태                  |
| `terminationReason` | `GameTerminationReason` | 아니오 | 종료 사유. `ONGOING`이면 `null` |
| `playedAt`          | `date`                  | 아니오 | 사용자가 입력한 대국 날짜       |
| `createdAt`         | `datetime`              | 예     | 정식 저장 생성 시각             |
| `updatedAt`         | `datetime`              | 예     | 마지막 수정 시각                |

### GameResult

| 값          | 의미    |
| ----------- | ------- |
| `ONGOING`   | 진행 중 |
| `WHITE_WIN` | 백 승   |
| `BLACK_WIN` | 흑 승   |
| `DRAW`      | 무승부  |

### GameTerminationReason

기존 엔진 자동 판정 값과 사용자 기록용 값을 함께 둔다.

| 값                      | 출처        | 의미                          |
| ----------------------- | ----------- | ----------------------------- |
| `CHECKMATE`             | 엔진        | 체크메이트                    |
| `STALEMATE`             | 엔진        | 스테일메이트                  |
| `FIFTY_MOVE`            | 엔진        | 50수 규칙                     |
| `THREEFOLD_REPETITION`  | 엔진        | 3회 반복                      |
| `INSUFFICIENT_MATERIAL` | 엔진        | 체크메이트 불가능한 기물 부족 |
| `RESIGNATION`           | 사용자 기록 | 기권                          |
| `AGREEMENT`             | 사용자 기록 | 합의 무승부                   |
| `OTHER`                 | 사용자 기록 | 기타                          |

## GameMove

정식 저장된 기보의 반수별 수순 정보다.

| 필드            | 타입             | 필수   | 설명                                       |
| --------------- | ---------------- | ------ | ------------------------------------------ |
| `id`            | `uuid`           | 예     | 반수 기록 고유 ID                          |
| `gameId`        | `uuid`           | 예     | 소속 `Game` ID                             |
| `halfMoveIndex` | `int`            | 예     | 기보 안에서 몇 번째 반수인지 나타내는 순서 |
| `san`           | `string`         | 예     | 표준 대수 표기법 문자열                    |
| `move`          | `jsonb`          | 예     | 엔진 `Move` 구조를 그대로 저장한 JSON 값   |
| `comment`       | `text`           | 아니오 | 반수별 사용자 코멘트                       |
| `annotation`    | `MoveAnnotation` | 아니오 | 반수별 착수 평가 기호의 의미 코드          |
| `createdAt`     | `datetime`       | 예     | 반수 기록 생성 시각                        |
| `updatedAt`     | `datetime`       | 예     | 반수 기록 마지막 수정 시각                 |

### halfMoveIndex

- `halfMoveIndex`는 기보 안의 반수 순서를 뜻한다.
- 엔진의 50수 규칙용 `halfmoveClock`과 다른 개념이다.
- 한 기보 안에서는 `gameId + halfMoveIndex`가 유일해야 한다.

### move

- 내부 엔진의 기존 숫자 상수 기반 `Move` 타입을 저장 계약에서도 재사용한다.
- 기보 복원 시 별도 mapper 없이 저장된 `move`를 `executeMove`에 전달할 수 있게 한다.
- 보드 복원은 표준 시작 포지션에서 `halfMoveIndex` 순서대로 `move`를 재생한다.
- 이번 ERD에서는 `gameStateAfter`를 저장하지 않는다.

예상 저장 형태:

```json
{
  "from": 12,
  "to": 28,
  "kind": 1
}
```

### MoveAnnotation

DB/API에서는 의미 코드를 저장하고, UI에서 기호로 표시한다.

| 값            | 표시 | 의미          |
| ------------- | ---- | ------------- |
| `BRILLIANT`   | `!!` | 매우 좋은 수  |
| `GOOD`        | `!`  | 좋은 수       |
| `INTERESTING` | `!?` | 흥미로운 수   |
| `DUBIOUS`     | `?!` | 의문스러운 수 |
| `MISTAKE`     | `?`  | 실수          |
| `BLUNDER`     | `??` | 큰 실수       |

## 제외 항목과 재검토 시점

| 항목                          | 이번에 제외하는 이유                  | 재검토 시점                             |
| ----------------------------- | ------------------------------------- | --------------------------------------- |
| `repositoryId`                | 저장소 생성/선택 기능이 아직 없다     | `FEATURE-004` 저장소 관리               |
| `deletedAt`                   | 삭제 기능이 아직 없다                 | `FEATURE-005` 기보 삭제                 |
| `initialFen` / `initialState` | 당장은 표준 시작 포지션만 전제한다    | 비표준 시작 포지션 요구 발생 시         |
| `gameStateAfter`              | 원본 데이터보다 캐시 성격이 강하다    | 상세 조회/분석 성능 문제가 확인될 때    |
| 코드 테이블                   | 지금은 enum 값 메타데이터가 필요 없다 | 다국어 label, 정렬, 활성화 요구 발생 시 |

## 구현 메모

- Prisma 실제 모델명과 컬럼명은 후속 `TASK-089`, `TASK-095`에서 확정한다.
- shared Zod 스키마는 이 ERD의 의미를 따르되, `GameMove.move`는 내부 엔진 `Move` 타입을 재사용한다.
- `GameMove.move`를 JSON으로 시작하되, 후속 통계/검색 요구가 강해지면 필요한 컬럼을 migration으로 분리한다.
