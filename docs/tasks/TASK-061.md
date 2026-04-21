# 📋 개별 작업 지침서: 승패 및 무승부 판정 (TASK-061)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-060]` (수 실행), `[TASK-010]` (체크 판정)  
**후속 작업**: `[TASK-062]` (SAN 기보 변환)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상태 전이는 가능하지만 현재 게임이 계속 진행 중인지, 메이트인지, 무승부인지 판정하는 종합 엔진은 없습니다.
- **이 작업의 책임**: 현재 상태와 과거 상태 이력을 바탕으로 메이트, 스테일메이트, 50수, 3회 반복, 기물 부족 여부를 판정합니다.
- **이번 작업에서 하지 않는 것**: SAN 생성과 저장 스키마 구성은 후속 태스크로 남깁니다.
- **경계 메모**:
  - 결과 판정만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: `getGameResult(state, history)`가 현재 게임 결과를 구조화된 타입으로 반환합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/engines/game-result-engine.ts`
  - `packages/shared/src/engines/game-result-engine.spec.ts`
  - `packages/shared/src/index.ts`
- **성공 기준 (AC)**:
  - 합법 수가 없고 체크 상태이면 체크메이트다.
  - 합법 수가 없고 체크가 아니면 스테일메이트다.
  - 50수, 3회 반복, 기물 부족 무승부를 판정한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/engines/game-result-engine.ts`
  - `packages/shared/src/engines/game-result-engine.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts`
- **이번 작업에서 수정하지 않음**:
  - `packages/shared/src/notation/san-converter.ts`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `GameResult` 유니온 타입과 `getGameResult` 시그니처를 고정합니다.
  - 동형 반복 판정용 position fingerprint helper를 둡니다.
  - 기물 부족 판정 helper를 분리합니다.
- **데이터 모델 해석**:
  - 입력은 현재 `GameState`와 과거 상태 배열입니다.
- **외부 의존성**:
  - shared 내부 `isCheck`, `isLegalMove` 계열 엔진
  - `vitest`
- **import/export 규칙**:
  - 판정 엔진은 `engines/` 아래에 두고 export를 index 한 곳에서 정리합니다.
- **권장 네이밍**:
  - `getGameResult`, `isThreefoldRepetition`, `hasInsufficientMaterial`, `positionFingerprint`
- **이름별 사용 의도와 적용 시점**:
  - `positionFingerprint`는 동형 반복 비교용 키를 만들 때 사용합니다.
- **인수 이름 가이드**:
  - `state`, `history`, `result`
- **짧은 예시 골격**:

```tsx
const result = getGameResult(state, history);
```

- **필수 describe/it 목록**:
  - `describe('getGameResult')`
  - `it('체크메이트를 판정한다')`
  - `it('스테일메이트를 판정한다')`
  - `it('50수 무승부를 판정한다')`
  - `it('3회 반복을 판정한다')`
- **최소 테스트 개수**:
  - 최소 5개
- **반드시 포함할 실패 시나리오**:
  - 턴 또는 캐슬링 권리가 다른데 같은 포지션으로 오판하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- `history`를 mutate하지 않습니다.
- 동형 반복 비교에는 턴/캐슬링/앙파상 상태를 모두 포함합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 체크메이트**
   - 합법 수가 없고 체크 상태
   - `CHECKMATE` 반환

2. **정상 시나리오: 3회 반복**
   - 같은 position fingerprint 3회
   - `DRAW`와 반복 사유 반환

3. **실패 시나리오: 오판 반복**
   - 기물 배치는 같지만 턴이 다름
   - 반복 무승부로 처리되면 테스트 실패

## 🚀 6. 권장 작업 순서

1. 결과 타입과 테스트를 작성합니다.
2. 메이트/스테일메이트 판정을 구현합니다.
3. 무승부 helper를 구현합니다.
4. index export를 연결하고 테스트를 통과시킵니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/shared test`
  - `pnpm --filter @chess-db/shared type-check`

## ✅ 7. 완료 판정 체크리스트

- [ ] 메이트/스테일메이트/무승부를 판정한다.
- [ ] 동형 반복과 기물 부족 규칙이 포함된다.
- [ ] 비교 키가 정확하다.

## 💬 9. 추천 커밋 메시지

- `feat: 게임 결과 판정 엔진을 구현 (TASK-061)`
