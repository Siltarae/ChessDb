# API 예외 로깅 도입

## 상태

- 초안
- 현재 범위 밖 후순위 계획

## 배경

- 공통 API 에러 응답은 클라이언트에 stack trace, raw exception, 내부 구현 상세를 노출하지 않는다.
- 운영 디버깅을 위해서는 클라이언트 응답과 별개로 서버 내부 로그에 원본 예외 정보를 남길 필요가 있다.
- 현재 작업 범위는 응답 표준화이므로 로깅은 별도 Task와 커밋으로 분리한다.

## 목표

- `ApiExceptionFilter`에서 예상하지 못한 예외를 서버 로그로 기록한다.
- 클라이언트 응답은 `{ statusCode, errorCode, message, details }` 계약을 유지한다.
- validation 실패 같은 정상적인 4xx 요청 오류는 불필요하게 error 로그로 남기지 않는다.

## 구현 후보

- Nest `Logger`를 `ApiExceptionFilter`에 추가
- unknown error 처리 시 `logger.error()` 호출
- `HttpException` 중 5xx만 로깅할지, unknown error만 로깅할지 정책 결정
- 테스트에서 unknown error 발생 시 logger 호출 여부 검증
- 응답 body에 stack trace가 노출되지 않는지 기존 테스트 유지

## 제외 범위

- 외부 로그 수집기 연동
- request id/correlation id 도입
- 구조화 로그 포맷 확정
- 알림/모니터링 정책
- 모든 4xx 요청 오류 로깅

## 승격 조건

- unknown error를 운영에서 추적해야 할 필요가 생길 때
- Prisma 오류를 클라이언트 응답과 내부 로그로 분리해야 할 때
- request id 기반 추적 체계를 도입하기 전 최소 서버 로그가 필요할 때
