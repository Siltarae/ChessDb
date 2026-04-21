# 📋 개별 작업 지침서: 저장소 통계 집계 대상 확정 (TASK-054)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-025]` (정식 저장), `[TASK-033]` (저장소 선택 진입)  
**후속 작업**: `[TASK-055]` (포지션 일치 기보 검색)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 통계 기능 자체는 후속 구현 예정이지만, 어떤 데이터 집합을 집계 대상으로 삼을지 아직 코드와 문서에 고정돼 있지 않습니다.
- **이 작업의 책임**: 저장소 통계의 기본 집계 단위와 포함/제외 대상을 API와 query 경계에서 고정합니다.
- **이번 작업에서 하지 않는 것**: 실제 포지션 매칭과 후보 통계 계산은 후속 태스크에서 구현합니다.
- **경계 메모**:
  - 통계 대상 범위 정의만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 통계 조회가 항상 현재 저장소의 정식 저장 기보만을 대상으로 한다는 규칙이 명확해집니다.
- **이번 작업의 최소 결과물**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
  - `apps/api/src/modules/statistics/statistics.module.ts`
- **성공 기준 (AC)**:
  - 통계의 기본 집계 단위는 저장소다.
  - 통계 대상은 저장소 안의 정식 저장 기보다.
  - 초안은 기본 통계 집계 대상에 포함되지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
  - `apps/api/src/modules/statistics/statistics.module.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/statistics-panel/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - statistics repository에 저장소 범위와 정식 저장 필터를 공통 query로 고정합니다.
  - service는 모든 통계 계산 전에 공통 범위 필터를 재사용합니다.
- **데이터 모델 해석**:
  - 통계 대상 최소 조건은 `repositoryId`와 `isDraft = false` 같은 정식 저장 식별자입니다.
- **외부 의존성**:
  - `@prisma/client`
  - `@nestjs/common`
- **import/export 규칙**:
  - 집계 대상 필터는 repository layer 한 곳에서만 정의합니다.
- **권장 네이밍**:
  - `findPublishedGamesInRepository`, `repositoryScopedGames`, `includeDrafts = false`
- **이름별 사용 의도와 적용 시점**:
  - `findPublishedGamesInRepository`는 후속 통계 계산이 공통으로 사용하는 기본 진입 함수 이름입니다.
- **인수 이름 가이드**:
  - `repositoryId`
- **짧은 예시 골격**:

```tsx
const games = await findPublishedGamesInRepository(repositoryId);
```

- **필수 describe/it 목록**:
  - `describe('statistics scope')`
  - `it('저장소 범위의 정식 기보만 조회한다')`
  - `it('초안을 집계 대상에서 제외한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 다른 저장소 또는 초안 데이터가 집계 대상에 섞이는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 집계 대상 범위는 후속 모든 통계 API가 재사용해야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 저장소 범위 필터**
   - repositoryId를 주고 범위 query 실행
   - 해당 저장소 정식 기보만 반환

2. **실패 시나리오: 초안 포함**
   - isDraft 필터 누락
   - 범위 테스트 실패

## 🚀 6. 권장 작업 순서

1. repository 공통 범위 함수를 추가합니다.
2. service가 그 범위를 사용하도록 정리합니다.
3. 범위 필터 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/api test`
  - `pnpm --filter @chess-db/api build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 통계 범위가 저장소 단위로 고정된다.
- [ ] 초안이 제외된다.
- [ ] 후속 통계가 재사용할 공통 query가 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 통계 집계 대상을 저장소 내 정식 기보로 고정 (TASK-054)`
