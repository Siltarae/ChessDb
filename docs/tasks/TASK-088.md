# 📋 개별 작업 지침서: apps/api NestJS 프로젝트 초기화 및 Swagger 연동 (TASK-088)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]` (워크스페이스 초기화)  
**후속 작업**: `[TASK-089]` (DB 초기 설정)  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 백엔드 애플리케이션이 위치할 `apps/api` 폴더가 비어있거나 생성되지 않은 상태입니다.
- **이 작업의 책임**: NestJS 프레임워크를 기반으로 백엔드 서버 프로젝트를 초기화하고, API 명세 자동화를 위한 Swagger UI를 구성합니다.

- **이번 작업에서 하지 않는 것**: `[TASK-089]` (DB 초기 설정)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 apps/api NestJS 프로젝트 초기화 및 Swagger 연동 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter api dev` 실행 시 NestJS 서버가 구동되며, `/api/docs` 경로에서 API 문서를 확인할 수 있습니다.

- **이번 작업의 최소 결과물**:
  - `apps/api`

- **성공 기준 (AC)**:
  - `apps/api` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
  - `MainModule` 및 기본 컨트롤러가 에러 없이 작동한다.
  - `/api/docs` 접속 시 Swagger UI 화면이 나타난다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/api`

- **수정 대상**:
  - `apps/api`

- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-089]` (DB 초기 설정)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **프로젝트 생성**: `@nestjs/cli`를 사용하여 `apps/api`에 스캐폴딩 생성.
- **패키지명**: `@chess-db/api`로 명시.
- **TypeScript 설정**: 루트 `tsconfig.base.json` 확장 적용 및 `paths` 설정 공유.
- **Swagger 설정 (`main.ts`)**:
  ```ts
  const config = new DocumentBuilder()
    .setTitle('ChessDB API')
    .setDescription('체스 기보 저장소 프로젝트 API 명세서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  ```
- **필수 describe/it 목록**:
  - describe: `NestJS Server Bootstrapping`
    - it: `서버가 3000번 포트(또는 설정된 포트)에서 정상 시작되어야 한다`
    - it: `Swagger UI 페이지가 정상적으로 렌더링되어야 한다`

- **핵심 조립/흐름 규칙**:
  - `apps/api` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
  - `MainModule` 및 기본 컨트롤러가 에러 없이 작동한다.
  - `/api/docs` 접속 시 Swagger UI 화면이 나타난다.

- **데이터 모델 해석**:
  - 핵심 데이터는 Nest 앱 엔트리, 루트 모듈, Swagger 부트스트랩 설정입니다.
  - 입력은 `apps/api` 엔트리 구조와 HTTP 서버 초기화 계약이며, 출력은 실행 가능한 API 앱 스캐폴드입니다.

- **외부 의존성**:
  - `@nestjs/common`
  - `@nestjs/core`
  - `@nestjs/swagger`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: apps/api NestJS 프로젝트 초기화 및 Swagger 연동 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `bootstrap`, `AppModule`, `setupSwagger` 이름은 서버 진입 구조를 설명할 때 사용합니다.
  - `/docs` 같은 Swagger 경로는 문서 진입 URL로 고정할 때 사용합니다.

- **인수 이름 가이드**:
  - `app`, `document`, `config`

- **짧은 예시 골격**:

```ts
const app = await NestFactory.create(AppModule);
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - Swagger 설정을 main.ts 밖 여러 곳에 흩뿌리는 경우
  - API 앱 진입 스크립트가 루트 workspace와 맞지 않는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-089]` (DB 초기 설정)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - `apps/api` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - `apps/api`가 독립 실행 가능한 Nest 앱이어야 한다.
   - Swagger 문서가 부트스트랩 단계에서 함께 열려야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: apps/api NestJS 프로젝트 초기화 및 Swagger 연동 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/api build`
   - `pnpm --filter @chess-db/api test`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `apps/api` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
- [ ] `MainModule` 및 기본 컨트롤러가 에러 없이 작동한다.
- [ ] `/api/docs` 접속 시 Swagger UI 화면이 나타난다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/api NestJS 프로젝트 초기화 및 Swagger 문서화 설정 (TASK-088)`
