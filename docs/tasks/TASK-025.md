# 📋 개별 작업 지침서: 정식 저장 확정 및 서버 전송 (TASK-025)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-090]` (DTO 연결), `[TASK-022]` (자동 저장)  
**후속 작업**: `FEATURE-003` 완료  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 로컬 저장은 완벽하나, 서버(DB)에 데이터를 전송하여 영구적으로 보존하는 기능이 없습니다.
- **이 작업의 책임**: 현재의 모든 기보 데이터(`GameRecord`)를 백엔드 API로 전송하여 PostgreSQL에 영구 저장하고, 성공 시 로컬 초안을 정리합니다.

- **이번 작업에서 하지 않는 것**: `FEATURE-003` 완료에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 정식 저장 확정 및 서버 전송 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: '정식 저장' 클릭 시 서버에 기록되고, 사용자는 저장된 기보 목록 또는 상세 화면으로 이동합니다.
- **성공 기준 (AC)**:
  - 서버 응답 성공 시에만 로컬 초안을 삭제해야 한다.
  - 네트워크 오류나 서버 에러 발생 시 사용자에게 적절한 경고 토스트를 표시해야 한다.

- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/save-game/ui/save-game-button.tsx`
  - `apps/web/src/features/save-game/model/use-save-game.ts`
  - `apps/web/src/features/save-game/api/save-game.ts`

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/save-game/ui/save-game-button.tsx`
  - `apps/web/src/features/save-game/model/use-save-game.ts`
  - `apps/web/src/features/save-game/api/save-game.ts`
- **수정 대상**:
  - `apps/web/src/pages/notation-input-page.tsx`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `FEATURE-003` 완료에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **프론트엔드 (Web)**:
  - `TanStack Query`의 `useMutation` 활용.
  - `POST /api/games` 엔드포인트 호출.
  - 전송 데이터는 `shared` 패키지의 `GameRecord` 스키마 형식을 준수.
- **백엔드 (API)**:
  - `GamesController.create` 메서드 구현.
  - `Prisma`를 사용하여 `Game` 테이블에 레코드 생성 (수순은 JSONB 또는 별도 테이블).
- **성공 후 처리**:
  - `localStorage` 초안 삭제.
  - `toast.success('기보가 저장되었습니다.')` 표시.
  - 기보 상세 페이지(`/games/:id`)로 리다이렉트.

- **핵심 조립/흐름 규칙**:
  - 서버에 데이터가 에러 없이 전송되고 DB에 정상 기록된다.
  - 저장 성공 후 로컬의 자동 저장 데이터가 성공적으로 정리된다.
  - 중복 요청 방지를 위한 Loading 상태 처리가 되어 있다.

- **데이터 모델 해석**:
  - 입력은 현재 draft 기록과 현재 저장소 식별자입니다.
  - 출력은 서버 저장 성공/실패 상태와 저장 후 화면 전이 또는 invalidate 결과입니다.

- **외부 의존성**:
  - `react`
  - `@tanstack/react-query`
  - `@/shared/api/client`
  - `@chess-db/shared` `GameRecordSchema`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: 정식 저장 확정 및 서버 전송 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `useSaveGame`은 draft 직렬화와 mutation 상태를 함께 노출할 때 사용합니다.
  - `saveGame`은 순수 API 함수 이름으로 유지합니다.

- **인수 이름 가이드**:
  - `draftRecord`, `repositoryId`, `savePayload`

- **짧은 예시 골격**:

```ts
await saveGame({ repositoryId, record: draftRecord });
```

- **필수 describe/it 목록**:
  - 최상위 describe: `정식 저장 확정 및 서버 전송`
  - 필수 it: 요구사항 문서의 완료 기준을 직접 검증하는 테스트

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - 스키마 검증 없이 draft를 그대로 전송하는 경우
  - 저장 성공 후 draft 정리나 목록 갱신을 하지 않는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `FEATURE-003` 완료에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - 서버에 데이터가 에러 없이 전송되고 DB에 정상 기록된다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - 정식 저장 payload가 스키마를 통과해야 한다.
   - 저장 성공 뒤 후속 화면 상태가 정리되어야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: 정식 저장 확정 및 서버 전송 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/web build`
   - `pnpm --filter @chess-db/web test`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] 서버에 데이터가 에러 없이 전송되고 DB에 정상 기록된다.
- [ ] 저장 성공 후 로컬의 자동 저장 데이터가 성공적으로 정리된다.
- [ ] 중복 요청 방지를 위한 Loading 상태 처리가 되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 정식 저장 기능 및 서버 연동 구현 (TASK-025)`
