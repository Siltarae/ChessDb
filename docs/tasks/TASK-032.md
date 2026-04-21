# 📋 개별 작업 지침서: 저장소 목록 생성 순 정렬 (TASK-032)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-028]` (저장소 목록 화면 표시)  
**후속 작업**: `[TASK-033]` (저장소 선택 진입)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 목록은 표시되지만 생성 순 기본 정렬 규칙이 문서와 query에 고정되어 있지 않습니다.
- **이 작업의 책임**: 저장소 목록의 기본 정렬을 생성 순으로 고정하고 UI와 query가 같은 규칙을 따르도록 합니다.
- **이번 작업에서 하지 않는 것**: 이름순, 수동 정렬, 사용자 설정 정렬은 현재 범위에 포함하지 않습니다.
- **경계 메모**:
  - 기본 정렬 규칙만 다루며 정렬 UI는 만들지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 저장소 목록이 생성 순으로 안정적으로 렌더링됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/entities/repository/model/repository-list-query.ts`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
- **성공 기준 (AC)**:
  - 기본 목록이 생성 순으로 표시된다.
  - 이 규칙이 빈 상태/추가 생성 이후에도 유지된다.
  - 다른 정렬 기준을 암묵적으로 섞지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/entities/repository/model/repository-list-query.ts`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
- **이번 작업에서 수정하지 않음**:
  - 정렬 토글 UI 전부
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - query 결과를 서버에서 정렬하거나, 클라이언트 fallback 정렬을 한 곳에서만 적용합니다.
  - widget은 받은 순서를 다시 섞지 않고 그대로 렌더링합니다.
- **데이터 모델 해석**:
  - 정렬 기준은 `createdAt` 또는 서버가 보장하는 생성 순 필드입니다.
- **외부 의존성**:
  - `@tanstack/react-query`
- **import/export 규칙**:
  - 정렬은 query layer 또는 API layer 한 곳에서만 수행합니다.
- **권장 네이밍**:
  - `sortRepositoriesByCreatedAt`, `orderedRepositories`
- **이름별 사용 의도와 적용 시점**:
  - `orderedRepositories`는 정렬된 최종 배열을 뜻할 때만 사용합니다.
- **인수 이름 가이드**:
  - `repositories`, `createdAt`
- **짧은 예시 골격**:

```tsx
const orderedRepositories = [...repositories].sort(sortRepositoriesByCreatedAt);
```

- **필수 describe/it 목록**:
  - `describe('repository ordering')`
  - `it('생성 순으로 정렬한다')`
  - `it('widget이 전달받은 순서를 다시 변경하지 않는다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - query와 widget 양쪽에서 서로 다른 정렬을 적용하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 이름순 정렬은 넣지 않습니다.
- 정렬 규칙은 한 곳에서만 정의합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 생성 순 렌더링**
   - createdAt이 다른 저장소 세 개
   - 생성 순으로 보임

2. **실패 시나리오: 이중 정렬**
   - query와 widget이 서로 다른 방향으로 정렬
   - 순서 snapshot 테스트 실패

## 🚀 6. 권장 작업 순서

1. query 또는 API 응답에서 기본 정렬을 고정합니다.
2. widget이 순서를 다시 바꾸지 않는지 정리합니다.
3. 정렬 snapshot 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 기본 정렬이 생성 순이다.
- [ ] 정렬 규칙이 한 곳에만 있다.
- [ ] 정렬 UI가 섞여 들어오지 않았다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 목록 기본 정렬을 생성 순으로 고정 (TASK-032)`
