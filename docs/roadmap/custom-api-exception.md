# 커스텀 ApiException 도입

## 상태

- 초안
- 현재 범위 밖 후순위 계획

## 배경

- 현재 API 에러 표준화 작업은 Nest 기본 예외, Zod 검증 예외, unknown error를 공통 응답으로 변환한다.
- 아직 도메인/유스케이스에서 `errorCode`, `message`, `details`를 명시적으로 지정해 던지는 호출 지점은 없다.
- 호출 지점 없이 커스텀 예외 베이스를 먼저 만들면 사용처 없는 추상화가 된다.

## 목표

- 도메인/유스케이스 계층에서 의도한 API 에러 코드를 안정적으로 표현한다.
- `ApiExceptionFilter`가 커스텀 예외의 `statusCode`, `errorCode`, `message`, `details`를 그대로 공통 응답으로 변환한다.
- 클라이언트가 `errorCode` 기준으로 복구 흐름과 사용자 메시지를 분기할 수 있게 한다.

## 응답 형태 후보

```ts
type ApiErrorResponse = {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly message: string;
  readonly details: readonly unknown[];
};
```

## 구현 후보

- `ApiException` 베이스 클래스 추가
- `ApiException` 전용 payload 타입 추가
- `ApiExceptionFilter`에서 커스텀 예외 우선 처리
- 도메인별 예외 클래스는 실제 호출 지점이 생길 때만 추가
  - 예: `GameNotFoundException`
  - 예: `DuplicateGameException`

## 제외 범위

- 도메인별 에러 코드 전체 카탈로그 선작성
- 실제 호출 지점 없는 예외 클래스 선작성
- 프론트엔드 토스트 문구 정책
- 인증/인가 예외 정책

## 승격 조건

- API 엔드포인트가 늘어나 같은 HTTP status 안에서도 클라이언트 분기가 필요할 때
- 서비스/유스케이스에서 의도적으로 특정 `errorCode`를 던져야 할 때
- Prisma 제약 오류를 사용자 의미가 있는 충돌 예외로 변환해야 할 때
