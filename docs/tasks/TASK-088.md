# 📋 개별 작업 지침서: apps/api NestJS 프로젝트 초기화 및 Swagger 연동 (TASK-088)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]` (워크스페이스 초기화)  
**후속 작업**: `[TASK-089]` (DB 초기 설정)  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 백엔드 애플리케이션이 위치할 `apps/api` 폴더가 비어있거나 생성되지 않은 상태입니다.
- **이 작업의 책임**: NestJS 프레임워크를 기반으로 백엔드 서버 프로젝트를 초기화하고, API 명세 자동화를 위한 Swagger UI를 구성합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter api dev` 실행 시 NestJS 서버가 구동되며, `/api/docs` 경로에서 API 문서를 확인할 수 있습니다.

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

## ✅ 7. 완료 판정 체크리스트

- [ ] `apps/api` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
- [ ] `MainModule` 및 기본 컨트롤러가 에러 없이 작동한다.
- [ ] `/api/docs` 접속 시 Swagger UI 화면이 나타난다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/api NestJS 프로젝트 초기화 및 Swagger 문서화 설정 (TASK-088)`
