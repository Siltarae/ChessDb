# TASK-088 apps/api NestJS 프로젝트 초기화 및 Swagger 연동

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-088.md)

## 상위 Feature

- [FEATURE-003 기보 메타데이터 입력 및 초안 저장 관리](../features/FEATURE-003.md)

## 목적

- 기보 데이터 영구 저장을 처리할 백엔드 애플리케이션인 NestJS 프로젝트를 시작하고 API 문서를 구성한다.

## 완료 조건

- [ ] `apps/api`에 `@nestjs/cli`를 사용하여 기본 애플리케이션 구조가 생성되어야 한다.
- [ ] `@nestjs/swagger`가 설치되고 `main.ts`에 Swagger UI 진입점(예: `/api/docs`)이 설정되어야 한다.
- [ ] `package.json`에 `pnpm run dev` 등 실행 스크립트가 모노레포 구조에 맞게 구성되어야 한다.

## 참고 사항

- 아직 세부 컨트롤러나 서비스 로직은 작성하지 않는다.

## 💬 9. 추천 커밋 메시지

- `chore: update TASK-088.md`
