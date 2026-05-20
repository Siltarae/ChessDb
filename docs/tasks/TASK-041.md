# 📋 개별 작업 지침서: 기보 상세 수순 목록 표시 (TASK-041)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-039]` (기보 상세 화면 구성)  
**후속 작업**: `[TASK-042]` (수순 선택 시 보드 이동)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상세 편집 페이지에 보드 자리만 있어도 수순 목록을 함께 보여주는 위젯은 아직 없습니다.
- **이 작업의 책임**: 상세 편집 화면에 수순 목록 위젯을 배치하고 저장된 수순을 읽어 표시합니다.
- **이번 작업에서 하지 않는 것**: 수순 선택에 따른 보드 이동 상호작용은 다음 태스크에서 처리합니다.
- **경계 메모**:
  - 이번 태스크는 수순 표시만 다루고, 수순 수정은 `[TASK-103]`에서 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 상세 편집 뷰에서 저장된 수순 목록을 함께 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/pages/game-detail-page.tsx`
- **성공 기준 (AC)**:
  - 상세 화면에 수순 목록이 보인다.
  - 수순 목록은 현재 기보의 진행 순서를 반영한다.
  - 코멘트, 어노테이션, 수순 수정의 기준점이 되는 반수 인덱스가 유지된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-detail-navigation/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-detail-move-list.tsx`는 SAN 문자열 또는 저장된 수순 표현을 목록으로 렌더링합니다.
  - 행 번호/반수 인덱스를 함께 표시해 이후 선택 연동 태스크의 기준점을 고정합니다.
- **데이터 모델 해석**:
  - 목록 item은 최소 `plyIndex`, `san`, `comment`, `annotation`을 가질 수 있습니다.
- **외부 의존성**:
  - `@/shared/ui/scroll-area`
- **import/export 규칙**:
  - 수순 목록 위젯은 보드 이동 로직을 아직 포함하지 않습니다.
- **권장 네이밍**:
  - `GameDetailMoveList`, `moveItems`, `plyIndex`
- **이름별 사용 의도와 적용 시점**:
  - `moveItems`는 표시용으로 정리된 상세 수순 배열을 뜻할 때 사용합니다.
- **인수 이름 가이드**:
  - `moves`, `selectedPlyIndex`
- **짧은 예시 골격**:

```tsx
<GameDetailMoveList moves={data.moves} />
```

- **필수 describe/it 목록**:
  - `describe('GameDetailMoveList')`
  - `it('저장된 수순 목록을 렌더링한다')`
  - `it('반수 인덱스를 유지해 렌더링한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 수순 목록이 저장 순서를 잃는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 이번 태스크에서는 수순 수정 UI를 구현하지 않습니다.
- 선택 시 보드 이동은 다음 태스크로 넘깁니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 수순 목록 조회**
   - 상세 데이터를 연다.
   - SAN 수순 목록이 순서대로 보인다.

2. **실패 시나리오: 인덱스 누락**
   - 반수 인덱스를 계산하지 않고 문자열만 렌더링
   - 후속 선택 연동 테스트가 실패해야 함

## 🚀 6. 권장 작업 순서

1. 수순 목록 위젯을 작성합니다.
2. 상세 page에 위젯을 배치합니다.
3. 순서와 반수 인덱스 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 상세 화면에 수순 목록이 보인다.
- [ ] 반수 순서가 유지된다.
- [ ] 후속 선택 연동과 수순 수정 기준점이 마련된다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 상세 화면에 수순 목록 위젯을 추가`
