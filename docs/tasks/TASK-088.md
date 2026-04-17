# 📋 개별 작업 지침서: apps/api NestJS 프로젝트 초기화 및 Swagger 연동 (TASK-088)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`, `[TASK-066]`  
**후속 작업**: `[TASK-089]`, `[TASK-093]`  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 루트 설정은 완료되었으나, 백엔드 애플리케이션이 위치할 `apps/api` 폴더는 존재하지 않는 상태입니다.
- **이 작업의 책임**: NestJS 프레임워크를 기반으로 백엔드 서버 프로젝트를 초기화하고, API 명세 자동화를 위한 Swagger UI를 구성합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter api dev` 실행 시 NestJS 서버가 구동되며, 브라우저에서 Swagger UI 화면을 확인할 수 있습니다.
- **성공 기준 (AC)**:
  - NestJS의 표준 모듈 구조(AppModule 등)가 구축되어야 한다.
  - `/api/docs` (또는 지정한 경로) 접속 시 Swagger 문서가 출력되어야 한다.

## 🛠️ 3. 상세 기술 사양

- **프로젝트 생성**: `@nestjs/cli`를 사용하여 `apps/api`에 스캐폴딩 생성.
- **TypeScript 설정**: 루트 `tsconfig.base.json` 확장 적용.
- **Swagger 설정 (`main.ts`)**:
  ```ts
  const config = new DocumentBuilder()
    .setTitle('ChessDB API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  ```

## ✅ 4. 완료 판정 체크리스트

- [ ] NestJS 서버가 3000(또는 지정) 포트에서 정상 구동된다.
- [ ] Swagger UI 페이지가 정상적으로 렌더링된다.
