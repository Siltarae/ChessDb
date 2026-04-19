# TASK-089 apps/api PostgreSQL + Prisma 초기 설정 및 로컬 DB(docker-compose) 구성

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-089.md)

## 상위 Feature

- [FEATURE-003 기보 메타데이터 입력 및 초안 저장 관리](../features/FEATURE-003.md)

## 목적

- 데이터베이스 연결 및 ORM 설정과 로컬 개발을 위한 컨테이너 환경을 구축한다.

## 완료 조건

- [ ] `apps/api` (또는 프로젝트 루트)에 PostgreSQL 구동을 위한 `docker-compose.yml`이 생성되어야 한다.
- [ ] `prisma`가 설치되고 `prisma/schema.prisma` 파일이 초기화되어야 한다.
- [ ] 로컬 DB 컨테이너 실행 후 Prisma 연결 테스트가 성공해야 한다.

## 참고 사항

- 기보와 관련된 실제 테이블 스키마 설계는 이후 태스크 진행 과정에서 추가한다.

## 💬 9. 추천 커밋 메시지

- `chore: update TASK-089.md`
