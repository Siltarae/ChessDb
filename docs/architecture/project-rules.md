# 프로젝트 전역 규칙

## 목적

- 프로젝트 전체에 공통으로 적용할 구현 및 운영 규칙을 기록한다.
- Task 문서마다 반복해서 적지 않아도 되는 전역 기준을 한 곳에서 관리한다.

## 작성 원칙

- 아래 규칙은 실제로 합의된 내용만 기록한다.
- 특정 Task에만 해당하는 내용은 Task 문서에 적고, 반복 적용되는 규칙만 이 문서에 올린다.

## 네이밍 규칙

- **파일명 및 폴더명**: 예외 없이 모두 소문자 케밥 케이스(`kebab-case`)를 사용한다. (예: `chess-board.component.tsx`)
- **React 컴포넌트, 클래스, 타입, 인터페이스**: 파스칼 케이스(`PascalCase`)를 사용한다.
- **변수, 함수, 메서드**: 카멜 케이스(`camelCase`)를 사용한다.
- **상수 및 Enum**: 대문자 스네이크 케이스(`UPPER_SNAKE_CASE`)를 사용한다.
- **Boolean 변수**: 반드시 상태를 묻는 조동사(`is`, `has`, `should`, `can`)로 시작한다.

## import/export 규칙

- **Named Export 강제**: 프레임워크가 강제하는 파일(라우팅, 설정 등)을 제외하고, 모든 내보내기는 `Named Export`만 사용하여 리팩토링 안정성을 확보한다.
- **절대 경로 사용 우선**: 파일 간 import 시 상대 경로(`../../`) 사용을 최소화하고, tsconfig에 설정된 절대 경로(`@/shared`, `@frontend` 등)를 우선적으로 사용한다.

## 상태 및 불변성 규칙

- **절대 불변성(Immutability)**: 배열이나 객체 형태의 전역/로컬 상태를 직접 수정(mutate)하는 것을 엄격히 금지하며, 항상 복사본(Spread 연산자 등)을 생성하여 반영한다.
- **도메인 모델의 Readonly**: `packages/shared` 내부의 핵심 체스 상태 모델 인터페이스에는 `readonly` 속성을 강제하여 컴파일 타임에 원본 데이터 오염을 100% 방지한다.
- **상태 격리**: 서버에서 가져온 API 응답(`TanStack Query`)을 전역 UI 스토어(`Zustand`)에 억지로 복사하여 이중 관리하지 않는다.

## 에러 처리 규칙

- **공통 에러 응답 포맷**: 백엔드의 모든 예외 상황은 클라이언트가 파싱하기 쉬운 단일 공통 JSON 구조(`{ statusCode, errorCode, message }` 등)로 규격화하여 반환한다.
- **Fail-Fast (사전 차단)**: 잘못된 입력(API Payload 등)은 비즈니스 로직을 타기 전 가장 바깥쪽 경계에서 Zod 스키마 검증을 통해 즉시 차단한다.
- **UI 에러 격리**: 컴포넌트 렌더링 중 발생하는 런타임 에러는 `react-error-boundary`를 통해 격리하여 앱 전체가 멈추는 현상을 방지한다.

## 환경 변수 및 보안 규칙

- **런타임 타입 검증 강제**: 프론트엔드와 백엔드 모두 앱 구동 시점에 필요한 필수 환경변수(`.env`)의 존재 유무와 타입을 Zod로 강제 검증하여 누락 시 빌드/실행을 중단시킨다.
- **환경 분리 및 양식 공유**: 환경별(`.env.local`, `.env.production` 등)로 변수를 분리 관리하며, GitHub 저장소에는 반드시 `.env.example` 템플릿을 만들어 필수 환경변수 양식을 공유한다.

## 데이터베이스 규칙

- **Soft Delete 정책**: 사용자가 기보나 저장소를 삭제할 때 실제 DB 레코드를 날리지(`DELETE`) 않고, `deletedAt` 컬럼에 타임스탬프를 기록하는 논리적 삭제(Soft Delete) 방식을 사용하여 데이터 무결성과 복구 가능성을 보장한다.

## 테스트 작성 공통 규칙 (매우 엄격)

- **테스트 경계**: `packages/shared`의 핵심 체스 도메인 로직은 단위 테스트 커버리지 100%를 최우선 목표로 삼는다.
- **BDD(Behavior-Driven Development) 패턴 강제**: 테스트 구조는 Given-When-Then을 기반으로 명확히 시각적으로 분리한다.
  - **Given**: `describe` 블록으로 테스트 대상(함수명, 컴포넌트명)을 명시한다.
  - **When**: 내부 `describe` 또는 `context` 블록으로 특정 상황이나 조건을 명시한다. (예: "~할 때", "~인 경우")
  - **Then**: `it` 블록으로 기대되는 결과나 행동을 "~해야 한다" 형태의 한글 문장으로 명시한다.
- **주석 제거**: `// Arrange`, `// Act`, `// Assert` 같은 인위적인 주석은 코드 가독성을 해치므로 생략하고, 띄어쓰기로 영역을 구분한다.
- **Mock 및 Fixture 분리 강제**: 테스트에 쓰이는 긴 더미 데이터, FEN 문자열, Mock 함수 등은 `it` 블록 내부가 아니라 파일 상단이나 별도의 fixture 파일로 완전히 분리해야 한다.
- **코드 템플릿 (반드시 복사해서 사용할 것)**:

```typescript
// [1] Mock 데이터 및 Fixture 분리 (파일 상단)
const MOCK_INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe('PawnMovementEngine', () => { // Given (어떤 대상을)
  describe('초기 보드 상태에서 백 폰(e2)을 움직일 때', () => { // When (어떤 상황에)
    
    it('한 칸(e3) 또는 두 칸(e4)을 이동할 수 있어야 한다', () => { // Then (어떤 결과가 나와야 한다)
      const engine = new ChessEngine(MOCK_INITIAL_FEN);
      const pawnPosition = { file: 'e', rank: 2 };

      const legalMoves = engine.calculateLegalMoves(pawnPosition);

      expect(legalMoves).toContainEqual({ file: 'e', rank: 3 });
      expect(legalMoves).toContainEqual({ file: 'e', rank: 4 });
      expect(legalMoves.length).toBe(2);
    });

  });
});
```

## 문서화 규칙

- **API 자동 문서화**: 모든 백엔드 REST API는 `@nestjs/swagger`를 통해 코드 레벨에서 명세를 작성하고, 항상 최신 상태의 Swagger UI를 프론트엔드 개발자에게 제공해야 한다.

## 작업 운영 규칙

- 이슈는 Epic과 Feature 단위로 모두 생성한다.
- 작업 브랜치는 Feature 단위로 운영한다.
- 브랜치명은 `feature/FEATURE-xxx-기능명` 형식으로 작성한다.
- Task는 Feature 이슈 내부 체크리스트로 관리한다.
- Task는 구현 흐름에서 커밋 단위로 간주한다.
- Feature 문서에는 해당 Feature의 브랜치명을 기록한다.
- Task 문서에는 해당 Task의 추천 커밋 메시지를 기록한다.

## 브랜치 규칙

- 브랜치 prefix는 작업 성격을 빠르게 식별하기 위한 용도로 사용한다.
- 현재 기본 구현 브랜치 prefix는 `feature/`를 사용한다.
- `feature/`는 사용자 관점에서 의미 있는 기능 단위를 구현할 때 사용한다.
- 브랜치명에는 Feature 문서 번호를 함께 넣어 요구사항 문서와 추적 가능해야 한다.
- 브랜치명 예시는 `feature/FEATURE-001-기보-입력` 형식을 따른다.
- 필요 시 아래 prefix를 추가로 사용할 수 있다.
- `fix/`: 기능 결함이나 회귀를 수정할 때 사용한다.
- `docs/`: 문서 전용 변경을 분리할 때 사용한다.
- `refactor/`: 기능 변화 없이 구조 개선만 수행할 때 사용한다.
- `chore/`: 설정, 도구, 의존성, 자동화 작업에 사용한다.

## 브랜치 전략

- 기본 브랜치에서 직접 작업하지 않고 Feature 브랜치에서 작업한다.
- 하나의 Feature는 하나의 브랜치를 기준으로 진행한다.
- 하나의 브랜치 안에서는 여러 Task를 순차적으로 커밋 단위로 쌓는다.
- 브랜치는 해당 Feature 구현과 검증이 끝나면 병합 대상이 된다.
- 문서 전용 작업이나 긴급 수정처럼 Feature 브랜치가 맞지 않는 경우에는 prefix에 맞는 별도 브랜치를 사용할 수 있다.
- 기본 전략은 GitHub Flow를 따른다.
- 병합 시에는 Task 커밋 이력을 보존하기 위해 rebase 방식을 우선한다.
- squash merge는 Task 단위 커밋 추적이 흐려질 수 있으므로 기본값으로 사용하지 않는다.

## 커밋 메시지 규칙

- 커밋 메시지는 컨벤셔널 커밋 형식을 사용한다.
- 기본 형식은 `type: 변경 내용`이다.
- 커밋 메시지는 Task 단위 변경 의도가 바로 드러나야 한다.
- 추천 커밋 메시지는 각 Task 문서에 기록한다.

## 커밋 타입 규칙

- `feat`: 사용자 기능 추가 또는 기능 확장
- `fix`: 버그 수정 또는 잘못된 동작 보정
- `test`: 테스트 추가, 수정, 보강
- `docs`: 문서 추가 또는 수정
- `refactor`: 동작 변경 없이 구조를 개선하는 코드 정리
- `chore`: 빌드, 설정, 의존성, 도구 관련 변경

## 커밋 메시지 작성 원칙

- 한 커밋은 하나의 Task에 대응하도록 유지한다.
- 메시지는 구현 방법보다 변경 의도를 우선해서 적는다.
- 여러 성격의 변경이 섞였다면 커밋을 나누는 방향을 우선 검토한다.
- 테스트만 추가한 경우에는 `test:`를 우선 사용한다.
- 문서만 수정한 경우에는 `docs:`를 우선 사용한다.
