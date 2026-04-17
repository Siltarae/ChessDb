# FEATURE-003 기보 메타데이터 입력 및 초안 저장 관리

## 상위 Epic

- [EPIC-001 학습용 기보 저장 및 분석](../epics/EPIC-001.md)

## 브랜치명

- `feature/FEATURE-003-메타데이터-초안저장`

## 목적

- 기보에 필요한 학습용 부가 정보(코멘트, 평가 등)를 입력하고, 작성 중인 기보를 초안으로 안전하게 보존 및 확정한다.

## 동작 개요

- 기보와 메타데이터를 클라이언트에 저장하기 위한 로컬 스토리지 데이터 스키마를 설계한다.
- 수순 목록의 각 반수마다 코멘트와 착수 평가 기호를 입력할 수 있다.
- 게임 결과(승/무/패 및 종료 사유)와 대국 날짜를 기록할 수 있다.
- 입력 중인 모든 데이터(보드, 수순, 코멘트 등)는 브라우저 내에 초안으로 자동 저장된다.
- 새로고침 시 기존 초안 데이터를 복원하여 입력을 이어나갈 수 있다.
- 기존 초안이 있을 때 새 기보를 시작하면 사용자 확인 후 기존 초안을 폐기한다.
- 작성이 완료된 기보는 수동 저장을 통해 정식 기보로 확정된다.

## 하위 Task

- [TASK-088 apps/api NestJS 프로젝트 초기화 및 Swagger 연동](../tasks/TASK-088.md)
- [TASK-089 apps/api PostgreSQL + Prisma 초기 설정 및 로컬 DB(docker-compose) 구성](../tasks/TASK-089.md)
- [TASK-093 apps/api Jest 및 Supertest 기반 테스트 환경 구성](../tasks/TASK-093.md)
- [TASK-094 Zod를 활용한 전역 환경 변수(.env) 검증 체계 구축](../tasks/TASK-094.md)
- [TASK-090 apps/api & packages/shared API 통신용 공통 DTO(Zod) 공유 구조 연결](../tasks/TASK-090.md)
- [TASK-063 기보 및 저장소 관련 로컬 스토리지 데이터 스키마 정의](../tasks/TASK-063.md)
- [TASK-020 반수별 코멘트 입력](../tasks/TASK-020.md)
- [TASK-021 반수별 착수 평가 기호 입력](../tasks/TASK-021.md)
- [TASK-022 초안 자동 저장](../tasks/TASK-022.md)
- [TASK-023 새로고침 후 초안 복원](../tasks/TASK-023.md)
- [TASK-024 기존 초안 폐기 후 새 기보 시작](../tasks/TASK-024.md)
- [TASK-025 정식 저장 확정](../tasks/TASK-025.md)
- [TASK-026 기보 결과와 종료 사유 입력](../tasks/TASK-026.md)
- [TASK-027 대국 날짜 입력](../tasks/TASK-027.md)

## 메모

- 초안은 시스템 상 항상 1개만 유지된다.
- 정식 저장 이후에는 기보 상세 화면으로 이동하는 흐름과 자연스럽게 연결되어야 단다.
