# 📋 개별 작업 지침서: API 통신용 공통 DTO 공유 구조 연결 (TASK-090)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-063]` (GameRecord), `[TASK-088]` (API 초기화)  
**후속 작업**: `[TASK-025]` (정식 저장)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 프론트엔드와 백엔드가 각각 독립적으로 존재하여, API 요청/응답 시 데이터 타입의 불일치가 발생할 위험이 있습니다.
- **이 작업의 책임**: `packages/shared`에서 정의한 Zod 스키마를 활용하여 백엔드 검증(Validation)과 프론트엔드 타입 정의를 일원화합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `shared`의 스키마 하나만 수정하면 프론트엔드의 타입과 백엔드의 API 검증 로직이 동시에 최신화됩니다.

## 🛠️ 3. 상세 기술 사양

- **DTO 구조**: `packages/shared/src/dto` 폴더 생성 및 공통 요청/응답 스키마 배치.
- **백엔드 연동**: `nestjs-zod` 라이브러리 등을 사용하여 Zod 스키마를 NestJS의 `Pipe` 및 Swagger DTO로 변환.
- **프론트엔드 연동**: `z.infer<typeof Schema>`를 사용하여 API 통신부의 타입을 강제.
- **필수 describe/it 목록**:
  - describe: `DTO Type Safety`
    - it: `공통 스키마에 어긋나는 요청이 들어오면 백엔드에서 400 에러를 반환해야 한다`
    - it: `프론트엔드에서 API 응답 타입을 shared 패키지로부터 정확히 추론해야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] `shared` 패키지의 스키마가 백엔드의 `ValidationPipe`에 성공적으로 적용되었다.
- [ ] Swagger UI에서 공유 DTO의 필드 정보가 정확히 노출된다.
- [ ] 잘못된 데이터 형식에 대한 Fail-Fast 처리가 시스템 전반에 적용되었다.

## 💬 9. 추천 커밋 메시지

- `refactor: shared 패키지 기반 공통 DTO 및 타입 공유 구조 구축 (TASK-090)`
