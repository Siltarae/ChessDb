# Chess DB

Chess DB는 학습용 체스 기보를 입력하고, 반수별 메모와 평가 정보를 붙여 저장하는 모노레포 프로젝트입니다.

사용자는 체스 보드에서 기보를 입력하고, 각 수에 코멘트와 평가 기호를 붙이며, 게임 결과와 종료 사유 같은 메타데이터를 함께 관리할 수 있습니다. 작성 중인 기보는 브라우저 초안으로 보존되고, 완성된 기보는 API를 통해 정식 기보로 저장됩니다.

## 주요 기능

### 웹 애플리케이션

- 체스 보드와 수순 목록 기반 기보 입력
- 반수별 코멘트 입력
- 반수별 착수 평가 기호 입력
- 게임 결과, 종료 사유, 대국 날짜 입력
- 작성 중인 기보 초안 자동 저장
- 새로고침 후 기존 초안 복원
- 기존 초안 폐기 후 새 기보 시작 확인 흐름
- 정식 기보 저장 확정 흐름
- 저장 성공 토스트와 자동 숨김 처리
- 체스 엔진 결과 기반 메타데이터 자동 반영
  - 체크메이트 결과가 계산되면 결과/종료 사유 자동 반영
  - 사용자가 직접 수정한 결과/종료 사유는 자동 반영으로 덮어쓰지 않음

### API 애플리케이션

- NestJS 기반 API 앱
- Swagger 문서화
- PostgreSQL + Prisma 기반 영속성
- 기보 저장용 `GameRecord` 스키마
- 정식 기보 저장 API
- Zod 기반 환경 변수 검증
- shared DTO 기반 요청 검증
- 표준 API 에러 응답 포맷
- CI 환경에서 Prisma Client 자동 생성 보장

### 공통 패키지

- 웹/API가 공유하는 기보 저장 DTO
- Zod 기반 요청 스키마
- 기보 저장 도메인 모델 타입

## 기술 스택

### 공통

- Node.js `>=22`
- pnpm `>=10`
- Turborepo
- TypeScript
- ESLint
- Prettier
- Husky, lint-staged, commitlint

### Web

- React
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS
- Radix UI, shadcn 계열 UI 구성
- Vitest
- React Testing Library
- Playwright

### API

- NestJS
- Prisma
- PostgreSQL
- Zod
- nestjs-zod
- Jest
- Supertest

## 프로젝트 구조

```text
.
├── apps/
│   ├── web/                # React + Vite 프론트엔드 앱
│   └── api/                # NestJS 백엔드 앱
├── packages/
│   └── shared/             # 웹/API 공통 DTO, 스키마, 도메인 타입
├── docs/
│   ├── requirements/       # Epic, Feature, Task 요구사항 문서
│   ├── architecture/       # 아키텍처, ERD, 기술 결정 문서
│   ├── roadmap/            # 현재 범위 밖 후속 계획
│   ├── tasks/              # Task 구현 지침서
│   └── process/            # 개발 프로세스 문서
├── docker-compose.yml      # 로컬 PostgreSQL
├── pnpm-workspace.yaml     # pnpm 워크스페이스
└── turbo.json              # Turborepo 태스크 설정
```

웹 앱은 Feature-Sliced Design에 가까운 구조를 사용합니다.

```text
apps/web/src/
├── app/        # 전역 설정, 프로바이더, 라우터 진입점
├── pages/      # 라우팅 페이지
├── widgets/    # 여러 feature를 조합한 UI 블록
├── features/   # 사용자 행동 중심 기능
├── entities/   # 도메인 상태와 모델
└── shared/     # 공통 UI, 설정, API 클라이언트, 유틸리티
```

API 앱은 NestJS 모듈 구조를 따릅니다.

```text
apps/api/src/
├── common/     # 공통 에러 응답, 필터 등
├── core/       # config, database 등 전역 인프라
├── modules/    # 도메인 기능 모듈
├── app.module.ts
└── main.ts
```

## 로컬 개발 준비

### 1. 의존성 설치

```bash
pnpm install
```

### 2. API 환경 변수 준비

`apps/api/.env.example`을 기준으로 `apps/api/.env`를 만듭니다.

로컬 `docker-compose.yml`의 PostgreSQL을 사용할 때는 아래 값을 사용할 수 있습니다.

```env
DATABASE_URL="postgresql://chess_db:chess_db@localhost:15432/chess_db?schema=public"
PORT=3000
ALLOWED_ORIGINS="http://localhost:5173"
NODE_ENV=development
```

API 테스트용 환경은 `apps/api/.env.test.example`을 기준으로 `apps/api/.env.test`에 둡니다.

### 3. Web 환경 변수 준비

웹 앱은 API 주소를 `VITE_API_BASE_URL`로 읽습니다.

`apps/web/.env.development` 예시:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. 로컬 DB 실행

```bash
docker compose up -d
```

기본 DB 설정은 아래와 같습니다.

```text
host: localhost
port: 15432
database: chess_db
user: chess_db
password: chess_db
```

### 5. Prisma Client 생성

```bash
pnpm --filter @chess-db/api prisma:generate
```

API의 `build`, `test`, `type-check` 스크립트는 실행 전 Prisma Client를 자동 생성합니다. 다만 로컬에서 Prisma 생성 여부만 먼저 확인하고 싶을 때 위 명령을 사용할 수 있습니다.

## 로컬 실행

### 전체 개발 서버 실행

```bash
pnpm dev
```

Turborepo가 각 워크스페이스의 `dev` 태스크를 실행합니다.

### Web만 실행

```bash
pnpm --filter @chess-db/web dev
```

기본 Vite 개발 서버 주소는 `http://localhost:5173`입니다.

### API만 실행

```bash
pnpm --filter @chess-db/api dev
```

기본 API 서버 주소는 `http://localhost:3000`입니다.

Swagger 문서는 API 서버 실행 후 아래 주소에서 확인합니다.

```text
http://localhost:3000/api/docs
```

API 라우트에는 전역 prefix `/api`가 붙습니다.

## 주요 명령

### 루트 명령

```bash
pnpm build
pnpm lint
pnpm format:check
pnpm test
```

루트 `package.json`에 없는 태스크는 Turbo를 직접 호출합니다.

```bash
pnpm turbo run type-check
```

### Web 명령

```bash
pnpm --filter @chess-db/web dev
pnpm --filter @chess-db/web build
pnpm --filter @chess-db/web lint
pnpm --filter @chess-db/web format:check
pnpm --filter @chess-db/web test
pnpm --filter @chess-db/web test:coverage
pnpm --filter @chess-db/web type-check
```

### API 명령

```bash
pnpm --filter @chess-db/api dev
pnpm --filter @chess-db/api build
pnpm --filter @chess-db/api lint
pnpm --filter @chess-db/api format:check
pnpm --filter @chess-db/api test
pnpm --filter @chess-db/api test:e2e
pnpm --filter @chess-db/api test:coverage
pnpm --filter @chess-db/api type-check
pnpm --filter @chess-db/api prisma:validate
pnpm --filter @chess-db/api prisma:generate
```

### Shared 명령

```bash
pnpm --filter @chess-db/shared lint
pnpm --filter @chess-db/shared test
pnpm --filter @chess-db/shared build
```

## 데이터 흐름

### 초안 저장

1. 사용자가 기보, 코멘트, 평가 기호, 게임 정보를 입력합니다.
2. 웹 앱의 draft store가 현재 입력 상태를 로컬 초안으로 관리합니다.
3. 자동 저장 훅이 초안을 브라우저 저장소에 기록합니다.
4. 새로고침 시 복원 provider가 저장된 초안을 읽어 입력 상태를 되살립니다.
5. 사용자가 새 기보를 시작하려 할 때 기존 초안이 있으면 확인 흐름을 거칩니다.

### 정식 저장

1. 사용자가 저장 버튼을 누릅니다.
2. 웹 앱이 현재 기보와 메타데이터를 `CreateGameRecordRequest` 형태로 변환합니다.
3. shared DTO/Zod 스키마 기준으로 요청 계약을 맞춥니다.
4. API가 요청을 검증하고 Prisma repository를 통해 `GameRecord`를 저장합니다.
5. 저장 성공 후 웹 앱은 성공 토스트를 표시합니다.

### 엔진 기반 메타데이터 자동 반영

1. 기보 입력 결과에서 게임 종료 상태를 계산합니다.
2. 체크메이트 같은 엔진 결과가 있으면 결과와 종료 사유를 메타데이터 후보로 변환합니다.
3. 메타데이터가 자동 입력 상태일 때만 반영합니다.
4. 사용자가 직접 결과/종료 사유를 고친 뒤에는 자동 반영이 수동 값을 덮어쓰지 않습니다.

## API 에러 응답

API는 예외 응답을 표준 포맷으로 정리합니다.

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "요청 값이 올바르지 않습니다.",
  "path": "/api/games",
  "timestamp": "2026-05-20T00:00:00.000Z"
}
```

현재 범위에서는 공통 응답 포맷과 필터를 고정했습니다. 도메인별 세부 에러 타입은 후속 계획으로 분리했습니다.

## 문서

주요 문서는 아래에서 확인합니다.

- `docs/requirements/README.md`: 요구사항 문서 규칙
- `docs/requirements/features/FEATURE-003.md`: 기보 메타데이터 입력 및 초안 저장 관리 Feature 문서
- `docs/architecture/erd/FEATURE-003-game-record-erd.md`: 기보 저장 ERD
- `docs/architecture/directory-structure.md`: 디렉토리 구조 원칙
- `docs/architecture/project-rules.md`: 프로젝트 규칙
- `docs/roadmap/README.md`: 후속 계획 목록

## 라이선스

MIT
