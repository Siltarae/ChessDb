# 📋 개별 작업 지침서: apps/api PostgreSQL + Prisma 초기 설정 (TASK-089)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]`  
**후속 작업**: `[TASK-090]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 백엔드 서버는 준비되었으나, 데이터를 저장할 데이터베이스와 이를 연결할 ORM 설정이 부재합니다.
- **이 작업의 책임**: Docker Compose를 이용한 PostgreSQL 환경 구축과 Prisma ORM의 초기 스키마 설정을 완료합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 로컬 DB 컨테이너가 실행 중이며, Prisma를 통해 DB와 연결 및 마이그레이션이 가능한 상태입니다.
- **핵심 산출물**: `docker-compose.yml`, `prisma/schema.prisma`, `.env`

## 🛠️ 3. 상세 기술 사양

- **Docker Compose**: `postgres:16-alpine` 이미지 사용.
- **Prisma**:
  - `datasource db { provider = "postgresql"; url = env("DATABASE_URL") }`
  - `generator client { provider = "prisma-client-js" }`
- **로컬 연결**: `DATABASE_URL="postgresql://user:pass@localhost:5432/chessdb"`

## ✅ 4. 완료 판정 체크리스트

- [ ] `docker-compose up` 실행 시 PostgreSQL 컨테이너가 정상 구동된다.
- [ ] `npx prisma db push` 또는 `migrate` 명령어가 성공적으로 실행된다.
- [ ] `PrismaClient`가 `apps/api`에서 정상적으로 생성 및 사용 가능하다.
