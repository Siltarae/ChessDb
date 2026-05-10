# 📋 개별 작업 지침서: SAN(Standard Algebraic Notation) 기보 변환 (TASK-062)

**작업 상태**: 완료
**선행 작업**: `[TASK-060]` (수 실행), `[TASK-010]` (체크 판정)
**후속 작업**: `[TASK-017]` (수순 목록 기록), `[TASK-063]` (기보 데이터 스키마)
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`
**UI 소비 기준**: `[../ui/FEATURE-002-board-interaction.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `packages/shared/src/notation/san-converter.ts`와 테스트가 구현되어 한 수를 `e4`, `Nf3`, `O-O` 같은 SAN 문자열로 변환할 수 있습니다.
- **이 작업의 책임**: 이동 전 상태와 착수 정보를 바탕으로 표준 SAN 문자열을 생성합니다.
- **이번 작업에서 하지 않는 것**: PGN 전체 문서 생성은 현재 범위에 포함하지 않습니다.
- **경계 메모**:
  - 한 수를 SAN 문자열로 변환하는 책임만 다룹니다.
  - `FEATURE-002`에서는 SAN 탭의 최근 SAN 표시와 수순 목록 셀에서 이 문자열을 소비한다.

## 🎯 1. 작업 목표

- **최종 상태**: `convertToSan(state, move, nextState)`가 표준 SAN 문자열을 반환합니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/notation/san-converter.ts`
  - `packages/shared/src/notation/san-converter.spec.ts`
  - `packages/shared/src/index.ts`
- **성공 기준 (AC)**:
  - 일반 이동, 캡처, 캐슬링, 프로모션을 정확히 변환한다.
  - 체크와 체크메이트 기호를 올바르게 추가한다.
  - 모호한 기물 이동 시 파일/랭크 식별을 처리한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/notation/san-converter.ts`
  - `packages/shared/src/notation/san-converter.spec.ts`
- **수정 대상**:
  - `packages/shared/src/index.ts`
- **이번 작업에서 수정하지 않음**:
  - PGN export 전체
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `convertToSan` 메인 함수와 모호성 해결 helper를 둡니다.
  - 캡처/프로모션/체크 기호를 단계적으로 조립합니다.
- **데이터 모델 해석**:
  - 입력은 이동 전 상태와 `Move`, 필요하면 이동 후 상태입니다. 출력은 문자열입니다.
- **외부 의존성**:
  - shared 내부 move executor/check engine
  - `vitest`
- **import/export 규칙**:
  - notation 관련 유틸은 `notation/` 하위에 두고 shared index에서 export합니다.
- **권장 네이밍**:
  - `convertToSan`, `resolveAmbiguity`, `getPieceNotation`, `suffixForCheckState`
- **이름별 사용 의도와 적용 시점**:
  - `resolveAmbiguity`는 같은 기물이 같은 목적지로 갈 수 있을 때 식별자를 붙이는 helper 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `state`, `move`, `nextState`
- **짧은 예시 골격**:

```tsx
const san = convertToSan(state, move, nextState);
```

- **필수 describe/it 목록**:
  - `describe('convertToSan')`
  - `it('일반 폰 이동을 e4로 변환한다')`
  - `it('캡처를 exd5로 변환한다')`
  - `it('캐슬링을 O-O 또는 O-O-O로 변환한다')`
  - `it('모호한 나이트 이동을 식별자와 함께 변환한다')`
- **최소 테스트 개수**:
  - 최소 5개
- **반드시 포함할 실패 시나리오**:
  - 모호성 해결 없이 같은 SAN 문자열을 두 수에 부여하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- SAN 생성은 순수 함수로 유지합니다.
- PGN 헤더/전체 게임 직렬화는 추가하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 일반 SAN 변환**
   - `e2 -> e4` 이동
   - `e4` 반환

2. **정상 시나리오: 체크메이트 표기**
   - 체크메이트가 되는 수
   - 문자열 끝에 `#` 추가

3. **실패 시나리오: 모호성 누락**
   - 두 나이트가 같은 칸으로 이동 가능
   - 파일/랭크 식별이 빠지면 테스트 실패

## 🚀 6. 권장 작업 순서

1. SAN 변환 테스트를 먼저 작성합니다.
2. 기본 표기 규칙을 구현합니다.
3. 모호성/체크 suffix helper를 추가합니다.
4. index export와 테스트를 정리합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/shared test`
  - `pnpm --filter @chess-db/shared type-check`

## ✅ 7. 완료 판정 체크리스트

- [ ] 핵심 SAN 규칙이 구현된다.
- [ ] 모호성 해결이 포함된다.
- [ ] 체크/메이트 suffix가 정확하다.

## 💬 9. 추천 커밋 메시지

- `feat: SAN 기보 변환 유틸리티를 구현 (TASK-062)`
