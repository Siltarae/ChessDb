# 📋 개별 작업 지침서: 게임 히스토리 및 영속성 데이터 스키마 정의 (TASK-063)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-060]` (Move 실행), `[TASK-062]` (SAN 변환)  
**후속 작업**: `[TASK-088]` (DB 초기화), `[TASK-020]` (기보 저장 UI)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 개별 `GameState`와 `Move`는 정의되어 있지만 한 판의 기보를 저장·검증할 통합 스키마는 아직 없습니다.
- **이 작업의 책임**: 게임 기록 전체를 표현하는 모델과 Zod 스키마를 정의해 브라우저 저장과 API DTO 공유의 기준을 만듭니다.
- **이번 작업에서 하지 않는 것**: DB 마이그레이션이나 UI 저장 플로우 연결은 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 공통 저장 스키마와 타입만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: `GameRecordSchema` 하나로 기보 전체 데이터를 검증하고 타입 추론할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/models/game-record.ts`
  - `packages/shared/src/schemas/game-record-schema.ts`
  - `packages/shared/src/schemas/game-record-schema.spec.ts`
  - `packages/shared/src/index.ts`
- **성공 기준 (AC)**:
  - 수순 이력에 `Move`와 SAN 문자열이 함께 들어간다.
  - 영속성 메타데이터가 포함된다.
  - 브라우저 저장과 API DTO 공유에 바로 사용할 수 있는 형태다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/models/game-record.ts`
  - `packages/shared/src/schemas/game-record-schema.ts`
  - `packages/shared/src/schemas/game-record-schema.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/api/prisma/schema.prisma`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `MoveHistoryItem`, `GameMetadata`, `GameRecord` 모델 타입을 정의합니다.
  - 동일 구조의 Zod 스키마를 별도 파일에 둡니다.
  - `z.infer`를 통해 타입과 런타임 검증을 같은 계약으로 유지합니다.
- **데이터 모델 해석**:
  - `GameRecord`는 `initialState`, `history`, `metadata`, `createdAt`, `updatedAt`를 포함하는 최상위 저장 모델입니다.
- **외부 의존성**:
  - `zod`
  - shared 내부 `Move`, `GameState` 타입
- **import/export 규칙**:
  - 모델 타입과 Zod 스키마를 파일로 분리합니다.
  - shared index에서 공개 계약만 export합니다.
- **권장 네이밍**:
  - `MoveHistoryItem`, `GameRecord`, `GameRecordSchema`, `GameMetadataSchema`
- **이름별 사용 의도와 적용 시점**:
  - `GameRecordSchema`는 브라우저 저장과 API DTO 양쪽이 공통으로 쓰는 최상위 스키마 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `gameRecord`, `historyItem`, `metadata`
- **짧은 예시 골격**:

```tsx
const parsedRecord = GameRecordSchema.parse(rawRecord);
```

- **필수 describe/it 목록**:
  - `describe('GameRecordSchema')`
  - `it('유효한 기보 기록을 통과시킨다')`
  - `it('history item 구조가 잘못되면 실패한다')`
  - `it('필수 메타데이터가 누락되면 실패한다')`
- **최소 테스트 개수**:
  - 최소 4개
- **반드시 포함할 실패 시나리오**:
  - 타입과 Zod 스키마 구조가 서로 다른 경우

## ⚖️ 4. 기술 제약 및 규칙

- 런타임 검증과 타입 추론 구조를 분리하지 않습니다.
- 후속 DB 스키마가 이 문서를 기준으로 따를 수 있어야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 유효한 GameRecord**
   - 정상 history와 metadata를 가진 객체
   - `GameRecordSchema.parse` 성공

2. **실패 시나리오: history 구조 오류**
   - SAN 문자열 누락
   - schema 검증 실패

3. **실패 시나리오: 계약 불일치**
   - TS 타입은 허용하지만 Zod가 거부
   - 테스트로 구조 불일치 검출

## 🚀 6. 권장 작업 순서

1. 모델 타입 파일을 작성합니다.
2. Zod 스키마 파일을 만듭니다.
3. shared index export를 연결합니다.
4. 유효/실패 케이스 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/shared test`
  - `pnpm --filter @chess-db/shared type-check`

## ✅ 7. 완료 판정 체크리스트

- [ ] 통합 저장 스키마가 존재한다.
- [ ] 타입과 런타임 검증 구조가 일치한다.
- [ ] 후속 UI/API가 재사용할 계약이 준비된다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 영속성용 GameRecord 스키마를 정의 (TASK-063)`
