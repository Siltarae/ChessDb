# 📋 개별 작업 지침서: apps/api PostgreSQL + Prisma 초기 설정 (TASK-089)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]` (API 초기화)  
**후속 작업**: `[TASK-094]` (환경 변수 검증)  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 백엔드 서버 프로젝트는 생성되었으나 데이터베이스 환경과 이를 연결할 ORM이 없습니다.
- **이 작업의 책임**: Docker Compose를 이용한 PostgreSQL 환경 구축과 Prisma ORM의 초기 설정을 완료합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 로컬 DB 컨테이너가 실행 중이며, Prisma를 통해 DB 스키마를 정의하고 마이그레이션할 수 있는 상태가 됩니다.

## 🛠️ 3. 상세 기술 사양

- **Docker Compose**: `postgres:16-alpine` 이미지 사용, 환경 변수(USER, PASSWORD, DB) 설정.
- **Prisma 설정**:
  - `datasource db { provider = "postgresql", url = env("DATABASE_URL") }`
  - `generator client { provider = "prisma-client-js" }`
- **패키지 추가**: `@prisma/client`, `prisma` (devDependencies).
- **필수 describe/it 목록**:
  - describe: `Database Connection`
    - it: `PostgreSQL 컨테이너와 연결이 성공해야 한다`
    - it: `Prisma 마이그레이션 명령어가 에러 없이 실행되어야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] `docker-compose up` 명령으로 DB 서버가 정상 구동된다.
- [ ] `schema.prisma` 파일에 초기 데이터 모델 골격이 작성되었다.
- [ ] `PrismaService`가 NestJS 모듈 내에 등록되어 주입 가능하다.

## 💬 9. 추천 커밋 메시지

- `feat: PostgreSQL 컨테이너 구축 및 Prisma ORM 초기 설정 (TASK-089)`
