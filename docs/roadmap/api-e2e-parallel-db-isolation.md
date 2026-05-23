# API E2E 병렬 실행을 위한 DB 격리

## 상태

- 초안
- 현재 범위 밖 후순위 계획

## 배경

- 현재 API E2E 테스트는 같은 테스트 DB를 공유한다.
- 각 E2E spec은 `beforeEach` 또는 `afterAll`에서 공용 테이블을 정리한다.
- 병렬 실행 시 한 spec의 DB cleanup이 다른 spec의 저장/검증 사이에 끼어들 수 있다.
- 현재는 안정성을 우선해 API E2E를 순차 실행한다.

## 목표

- API E2E 테스트를 병렬 실행해도 서로의 데이터에 간섭하지 않게 한다.
- 테스트 실패 시에도 다른 spec의 데이터 정리나 검증 결과가 오염되지 않게 한다.
- 병렬화가 필요한 시점에만 DB 격리 비용을 도입한다.

## 구현 후보

- Jest worker별 테스트 DB 분리
  - 예: `JEST_WORKER_ID=1`은 `chessdb_test_1` 사용
  - 예: `JEST_WORKER_ID=2`는 `chessdb_test_2` 사용
- 테스트 시작 전 worker DB 생성 및 Prisma migration 적용
- 테스트 종료 후 worker DB 삭제 또는 다음 실행을 위한 truncate
- 대안으로 Postgres schema를 worker별로 분리

## 제외 범위

- 현재 API E2E 순차 실행 설정 제거
- spec별 수동 id 추적 cleanup 선구현
- E2E 러너 교체
- 운영 DB나 개발 DB의 schema 변경

## 승격 조건

- API E2E 실행 시간이 개발 흐름이나 CI에서 병목이 될 때
- E2E spec 수가 늘어나 순차 실행 비용이 커질 때
- CI 병렬화를 유지하면서 DB 테스트 안정성을 보장해야 할 때
