# 📋 개별 작업 지침서: 다음 수 후보 집계 (TASK-056)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-055]` (포지션 일치 기보 검색)  
**후속 작업**: `[TASK-057]` (결과 비율 집계)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 포지션에 일치하는 기보 집합은 찾을 수 있어도, 그 다음에 자주 둔 수를 빈도 기준으로 묶는 단계가 없습니다.
- **이 작업의 책임**: 일치한 포지션 뒤에 이어진 다음 수 후보를 집계합니다.
- **이번 작업에서 하지 않는 것**: 후보별 결과 비율 계산은 다음 태스크에서 다룹니다.
- **경계 메모**:
  - 후보 수 빈도 계산만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 현재 포지션 다음에 많이 둔 수 후보를 통계로 구할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
- **성공 기준 (AC)**:
  - 특정 포지션 다음에 많이 둔 수를 보여준다.
  - 후보는 저장소 안의 기보 기록을 기준으로 집계된다.
  - 고급 필터링 없이도 기본 후보 조회가 가능하다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/statistics-panel/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 일치 포지션 집합에서 다음 반수의 SAN 또는 move key를 group by 합니다.
  - 빈도수 기준 내림차순 정렬 규칙을 service에서 고정합니다.
- **데이터 모델 해석**:
  - 후보 항목 최소 정보는 `move`, `count`입니다.
- **외부 의존성**:
  - `@prisma/client`
- **import/export 규칙**:
  - 집계 raw data와 응답 DTO 변환을 service에서 분리합니다.
- **권장 네이밍**:
  - `aggregateNextMoves`, `nextMoveCandidates`, `moveCount`
- **이름별 사용 의도와 적용 시점**:
  - `nextMoveCandidates`는 UI가 소비할 후보 목록 응답 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `matchingPositions`
- **짧은 예시 골격**:

```tsx
const nextMoveCandidates = aggregateNextMoves(matchingPositions);
```

- **필수 describe/it 목록**:
  - `describe('aggregateNextMoves')`
  - `it('다음 수 후보를 빈도별로 묶는다')`
  - `it('빈도수 기준으로 정렬한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 같은 수를 중복 그룹으로 남기는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 고급 필터링과 cutoff는 넣지 않습니다.
- 후보 정렬 기준을 count 내림차순으로 고정합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 후보 집계**
   - 일치 포지션 10개 입력
   - 다음 수 후보와 count 반환

2. **실패 시나리오: 그룹화 실패**
   - 같은 수가 두 항목으로 나뉨
   - 집계 테스트 실패

## 🚀 6. 권장 작업 순서

1. 다음 수 후보 집계 함수를 service에 추가합니다.
2. 필요하면 repository query 결과 구조를 보강합니다.
3. 그룹화/정렬 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/api test`
  - `pnpm --filter @chess-db/api build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 다음 수 후보 집계가 가능하다.
- [ ] 후보가 빈도순으로 정렬된다.
- [ ] 고급 필터링 없이 기본 후보 조회가 된다.

## 💬 9. 추천 커밋 메시지

- `feat: 포지션 다음 수 후보 집계를 추가`
