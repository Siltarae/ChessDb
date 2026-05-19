# 공통 API 에러 응답 포맷 표준화

## 상태

- 초안
- 현재 범위 밖 후순위 계획

## 배경

- 현재 API는 `POST /api/games` 중심이라 Nest 기본 예외 응답과 Zod 검증 `400`으로 동작한다.
- 프론트엔드 저장 실패 처리와 API 범위가 늘어나면 클라이언트가 안정적으로 파싱할 공통 에러 응답 계약이 필요하다.
- `docs/architecture/project-rules.md`와 `docs/architecture/integration-rules.md`는 이미 공통 에러 JSON 포맷을 원칙으로 둔다.

## 목표

- 백엔드 모든 예외 상황을 단일 JSON 구조로 반환한다.
- 프론트엔드는 에러 응답의 `errorCode`, `message`, `details`를 기준으로 사용자 메시지와 복구 흐름을 분기할 수 있다.

## 응답 형태 후보

```json
{
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "요청 값이 올바르지 않습니다.",
  "details": []
}
```

## 범위 후보

- 공통 `ExceptionFilter` 구현
- `APP_FILTER` 전역 등록
- `HttpException` 응답 매핑
- Zod validation error 응답 매핑
- Prisma error 응답 매핑
- unknown error를 `500 INTERNAL_SERVER_ERROR`로 매핑
- e2e 테스트로 에러 응답 모양 고정

## 제외 범위

- 프론트엔드 토스트/문구 정책
- 도메인별 상세 에러 코드 전체 목록 확정
- 인증/인가 에러 정책

## 승격 조건

- `TASK-025` 정식 저장 확정에서 저장 실패 UI가 API 에러 응답을 파싱해야 할 때
- API 엔드포인트가 2개 이상으로 늘어나 공통 에러 계약의 중복 비용이 커질 때
- Prisma 제약 오류를 사용자에게 구분해서 보여줘야 할 때
