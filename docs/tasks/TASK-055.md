# 📋 개별 작업 지침서: 포지션 일치 기보 검색 (TASK-055)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-054]` (통계 집계 대상 확정), `[TASK-050]` (분석 보드 직접 수 입력)  
**후속 작업**: `[TASK-056]` (다음 수 후보 집계)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 통계 대상 범위는 정했지만, 현재 분석 포지션과 일치하는 기보 집합을 찾는 검색 단계가 없습니다.
- **이 작업의 책임**: 현재 분석 포지션과 일치하는 반수 스냅샷을 저장소 내 정식 기보에서 검색합니다.
- **이번 작업에서 하지 않는 것**: 후보 수 빈도 집계와 결과 비율 계산은 후속 태스크로 넘깁니다.
- **경계 메모**:
  - 매칭 게임/반수 집합 찾기만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 현재 포지션과 일치하는 기보 집합을 구할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/api/src/modules/statistics/statistics.repository.ts`
  - `apps/api/src/modules/statistics/statistics.service.ts`
- **성공 기준 (AC)**:
  - 분석 포지션과 저장된 기보 기록을 매칭할 수 있다.
  - 일치 기보 집합이 다음 수 후보 집계의 기반이 된다.
  - 저장소 범위 안에서만 검색한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/api/src/modules/statistics/statistics.repository.ts`
  - `apps/api/src/modules/statistics/statistics.service.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/statistics-panel/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - repository에 `findMatchingPositions(repositoryId, positionKey)` 함수를 추가합니다.
  - service는 현재 분석 포지션을 통계용 키로 정규화한 뒤 repository에 전달합니다.
- **데이터 모델 해석**:
  - 포지션 비교 키는 FEN 또는 그에 준하는 정규화 문자열입니다.
- **외부 의존성**:
  - `@prisma/client`
- **import/export 규칙**:
  - 포지션 정규화와 DB 검색을 분리합니다.
- **권장 네이밍**:
  - `findMatchingPositions`, `positionKey`, `matchingPositions`
- **이름별 사용 의도와 적용 시점**:
  - `positionKey`는 현재 분석 포지션을 DB 비교 키로 변환한 문자열을 뜻합니다.
- **인수 이름 가이드**:
  - `repositoryId`, `positionKey`
- **짧은 예시 골격**:

```tsx
const matchingPositions = await findMatchingPositions(repositoryId, positionKey);
```

- **필수 describe/it 목록**:
  - `describe('findMatchingPositions')`
  - `it('동일 포지션을 가진 반수를 검색한다')`
  - `it('다른 저장소 데이터는 제외한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 포지션 정규화가 달라 동일 포지션을 찾지 못하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 검색 범위는 저장소 내 정식 기보만 사용합니다.
- 현재 범위에서는 고급 필터링을 추가하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 포지션 검색**
   - 현재 포지션 키 전달
   - 일치 반수 집합 반환

2. **실패 시나리오: 범위 누락**
   - repositoryId 없이 검색
   - 다른 저장소 결과가 섞여 실패

## 🚀 6. 권장 작업 순서

1. 포지션 키 정규화 규칙을 service에 둡니다.
2. repository 검색 함수를 작성합니다.
3. 범위/정규화 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/api test`
  - `pnpm --filter @chess-db/api build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 포지션 일치 기보 검색이 가능하다.
- [ ] 저장소 범위가 유지된다.
- [ ] 후속 후보 집계 입력이 준비된다.

## 💬 9. 추천 커밋 메시지

- `feat: 포지션 일치 기보 검색 단계를 추가`
