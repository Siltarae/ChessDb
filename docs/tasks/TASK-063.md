# 📋 개별 작업 지침서: 게임 히스토리 및 영속성 데이터 스키마 정의 (TASK-063)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-059]` (GameState), `[TASK-060]` (Move)  
**후속 작업**: `[TASK-088]` (DB 초기화), `[TASK-020]` (기보 저장 UI)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 개별 `GameState`와 `Move` 타입은 정의되어 있으나, 이를 묶어 하나의 완성된 '게임 기보'로 표현하는 구조는 부재합니다.
- **이 작업의 책임**: 오프라인 저장소(`localStorage`)나 데이터베이스(PostgreSQL)에 저장될 최종 '체스 게임' 데이터 구조를 Zod 스키마로 정의합니다.
- **경계 메모**: 실제 기보의 상세 메타데이터(대국자 이름, 대회명 등)와 각 수순의 이력을 포함합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `GameRecordSchema`를 통해 한 판의 체스 게임 전체를 검증하고 저장할 수 있는 통합 데이터 모델이 구축됩니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/models/game-record.ts` 생성.
  - 전체 기보 데이터에 대한 Zod 스키마 및 TypeScript 타입 정의.
- **성공 기준 (AC)**:
  - 수순 이력(`history`)이 `Move` 객체와 해당 수의 SAN 문자열을 모두 포함해야 한다.
  - 생성일, 수정일 등 영속성에 필요한 메타데이터가 포함되어야 한다.
  - `localStorage`에 즉시 저장 가능한 형태여야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/models/game-record.ts`
  - `packages/shared/src/models/game-record.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts` (export 추가)

## 🛠️ 3. 상세 기술 사양

- **핵심 데이터 모델**:

  ```ts
  export interface MoveHistoryItem {
    readonly move: Move;
    readonly san: string;
    readonly comment?: string;
  }

  export interface GameRecord {
    readonly id: string; // UUID
    readonly title: string;
    readonly initialFen?: string;
    readonly history: readonly MoveHistoryItem[];
    readonly metadata: {
      readonly whitePlayer?: string;
      readonly blackPlayer?: string;
      readonly event?: string;
      readonly date?: string;
    };
    readonly createdAt: string; // ISO String
    readonly updatedAt: string; // ISO String
  }
  ```

- **Zod 스키마 구성**:
  - `MoveHistoryItemSchema`: `MoveSchema`와 `z.string()` 결합.
  - `GameRecordSchema`: 위 모든 필드를 포함하는 최상위 스키마.
- **권장 네이밍**:
  - `MoveHistoryItem`: 개별 수순 기록 타입.
  - `GameRecord`: 전체 게임 기록 타입.
  - `LOCAL_STORAGE_KEY = 'chess-db-drafts'`: 저장소 키 이름.
- **필수 describe/it 목록**:
  - describe: `GameRecordSchema`
    - it: `모든 필수 필드가 포함된 게임 기록 객체는 검증을 통과해야 한다`
    - it: `수순 이력(history)이 하나라도 잘못된 형식이면 검증에 실패해야 한다`
    - it: `id가 UUID 형식이 아니면 검증에 실패해야 한다`
- **최소 테스트 개수**: 4개

## ⚖️ 4. 기술 제약 및 규칙

- **불변성**: 모든 필드에 `readonly`를 적용하여 도메인 모델 오염을 방지합니다.
- **날짜 형식**: `updatedAt` 등은 반드시 ISO 8601 형식의 문자열로 관리합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 신규 게임 생성**
   - Given: 1수(`e4`)가 포함된 전체 기록 객체.
   - Then: `GameRecordSchema.safeParse` 결과가 `success: true`.

2. **실패 시나리오: 수순 누락**
   - Given: `history` 필드가 없는 객체.
   - Then: 검증 실패 및 에러 메시지 확인.

## ✅ 7. 완료 판정 체크리스트

- [ ] `GameRecord` 스키마가 체스 기보 저장에 필요한 모든 정보를 포함한다.
- [ ] Zod를 통한 런타임 검증이 정확히 작동함을 테스트로 확인했다.
- [ ] 모든 import에 `.js` 확장자가 포함되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 게임 히스토리 및 영속성 데이터 스키마 정의 (TASK-063)`
