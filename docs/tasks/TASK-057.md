# 📋 개별 작업 지침서: 백승·무승부·흑승 비율 집계 (TASK-057)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-056]` (다음 수 후보 집계), `[TASK-026]` (결과 입력)  
**후속 작업**: `[TASK-058]` (통계 패널 표시 및 시각화)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 다음 수 후보 빈도는 구할 수 있어도, 각 후보가 어떤 결과 비율과 연결되는지 집계하는 단계가 없습니다.
- **이 작업의 책임**: 후보 수마다 백승·무승부·흑승 비율을 계산합니다.
- **이번 작업에서 하지 않는 것**: 종료 사유별 세부 통계는 현재 범위에 포함하지 않습니다.
- **경계 메모**:
  - 결과 비율 계산만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 각 다음 수 후보와 함께 결과 비율을 제공할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
- **성공 기준 (AC)**:
  - 결과 비율은 백승, 무승부, 흑승 기준으로 제공된다.
  - 비율 계산은 기보에 기록된 결과 메타데이터를 기반으로 한다.
  - 종료 사유별 세부 통계는 현재 범위에서 제외한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/api/src/modules/statistics/statistics.service.ts`
  - `apps/api/src/modules/statistics/statistics.repository.ts`
- **이번 작업에서 수정하지 않음**:
  - 종료 사유별 세부 통계 전체
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 후보별 집합에서 game result를 세어 `white`, `draw`, `black` 비율로 변환합니다.
  - 응답 DTO에 퍼센트 또는 비율 필드를 포함합니다.
- **데이터 모델 해석**:
  - 후보 통계 항목은 `move`, `count`, `whiteWinRate`, `drawRate`, `blackWinRate`를 가집니다.
- **외부 의존성**:
  - `@prisma/client`
- **import/export 규칙**:
  - 비율 계산은 service에서 하고 repository는 raw 결과만 제공합니다.
- **권장 네이밍**:
  - `attachOutcomeRates`, `whiteWinRate`, `drawRate`, `blackWinRate`
- **이름별 사용 의도와 적용 시점**:
  - `attachOutcomeRates`는 후보 집계 결과에 비율 메타를 덧붙일 때 사용합니다.
- **인수 이름 가이드**:
  - `candidateGames`
- **짧은 예시 골격**:

```tsx
const enrichedCandidates = attachOutcomeRates(nextMoveCandidates);
```

- **필수 describe/it 목록**:
  - `describe('attachOutcomeRates')`
  - `it('백승·무승부·흑승 비율을 계산한다')`
  - `it('결과 메타데이터 없는 게임을 안전하게 제외 또는 처리한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 백승/흑승 기준이 뒤바뀌는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 종료 사유 세부 통계는 넣지 않습니다.
- 결과 메타데이터가 없는 레코드 처리 규칙을 명시합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 결과 비율 계산**
   - 후보별 게임 결과 집합 입력
   - 세 비율 반환

2. **실패 시나리오: 결과 매핑 오류**
   - `1-0`과 `0-1` 매핑이 뒤바뀜
   - 비율 테스트 실패

## 🚀 6. 권장 작업 순서

1. 후보별 결과 집계를 service에 추가합니다.
2. 응답 DTO를 보강합니다.
3. 결과 매핑 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/api test`
  - `pnpm --filter @chess-db/api build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 백승·무승부·흑승 비율을 제공한다.
- [ ] 결과 메타데이터 기반으로 계산한다.
- [ ] 종료 사유 세부 통계는 포함하지 않는다.

## 💬 9. 추천 커밋 메시지

- `feat: 후보 수별 결과 비율 집계를 추가`
