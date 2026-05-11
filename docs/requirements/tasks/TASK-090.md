# TASK-090 apps/api & packages/shared API 통신용 공통 DTO(Zod) 공유 구조 연결

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-090.md)

## 상위 Feature

- [FEATURE-003 기보 메타데이터 입력 및 초안 저장 관리](../features/FEATURE-003.md)

## 목적

- 백엔드(NestJS)와 프론트엔드가 사용할 공통 데이터 스키마(DTO)를 `shared` 패키지를 통해 연동한다.

## 완료 조건

- [ ] `apps/api`의 의존성에 `packages/shared` 워크스페이스가 추가되어야 한다.
- [ ] `nestjs-zod`를 사용해 shared Zod 스키마 기반 요청 검증과 Swagger DTO 문서화가 연결되어야 한다.
- [ ] `shared` 패키지의 타입/스키마를 `apps/api`에서 import하여 빌드가 성공하는지 확인해야 한다.

## 참고 사항

- 이 구조는 프론트엔드(`apps/web`)에서도 동일하게 활용된다.
- 실제 `POST /api/games` 구현은 `TASK-095`에서 다룬다.

## 💬 9. 추천 커밋 메시지

- `chore: update TASK-090.md`
