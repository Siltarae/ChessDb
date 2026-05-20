# 📋 개별 작업 지침서: 저장소 생성 흐름 구축 (TASK-029)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-028]` (저장소 목록 화면 표시)  
**후속 작업**: `[TASK-030]` (저장소 이름 입력)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 목록은 볼 수 있지만 새 저장소 생성 흐름을 여는 버튼, 다이얼로그, 성공 후 갱신 흐름이 없습니다.
- **이 작업의 책임**: 저장소 생성 다이얼로그를 열고 닫는 흐름과 성공 시 목록 갱신의 상위 흐름을 준비합니다.
- **이번 작업에서 하지 않는 것**: 이름 입력 필드 세부 규칙은 `[TASK-030]`, 실제 생성 mutation은 `[TASK-031]`에서 닫습니다.
- **경계 메모**:
  - 다이얼로그 껍데기와 흐름만 고정합니다. 아직 생성 요청은 전송하지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소 목록 화면에서 새 저장소 생성 UI를 열 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
  - `apps/web/src/pages/repository-list-page.tsx`
- **성공 기준 (AC)**:
  - 생성 버튼을 누르면 다이얼로그가 열린다.
  - 취소하면 다이얼로그가 닫힌다.
  - 성공 시 목록 invalidate를 연결할 자리와 상태 흐름이 문서에 고정된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
- **수정 대상**:
  - `apps/web/src/pages/repository-list-page.tsx`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/repository-create/api/create-repository.ts`
  - `apps/web/src/features/repository-create/ui/repository-name-field.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `create-repository-dialog.tsx`는 open/close 상태와 슬롯만 먼저 제공합니다.
  - `repository-list-page.tsx`는 생성 버튼과 다이얼로그 mount를 담당합니다.
  - 성공 후 invalidate 콜백 prop 또는 hook 자리를 미리 정의합니다.
- **데이터 모델 해석**:
  - 생성 흐름의 최소 UI 상태는 `isOpen`과 `onOpenChange`입니다.
- **외부 의존성**:
  - `react`
  - `@/shared/ui/dialog`
- **import/export 규칙**:
  - 다이얼로그는 mutation을 직접 구현하지 않고 후속 태스크의 hook 연결 지점을 prop 또는 빈 슬롯으로 남깁니다.
- **권장 네이밍**:
  - `CreateRepositoryDialog`, `isCreateDialogOpen`, `handleCreateDialogChange`
- **이름별 사용 의도와 적용 시점**:
  - `CreateRepositoryDialog`는 이름 입력과 생성 버튼이 추가되더라도 같은 컨테이너 컴포넌트로 유지합니다.
- **인수 이름 가이드**:
  - `isOpen`, `onOpenChange`, `onCreated`
- **짧은 예시 골격**:

```tsx
const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
```

- **필수 describe/it 목록**:
  - `describe('CreateRepositoryDialog shell')`
  - `it('생성 버튼 클릭 시 다이얼로그가 열린다')`
  - `it('취소 시 다이얼로그가 닫힌다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 페이지 곳곳에 open state가 중복되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 실제 mutation 호출은 후속 태스크에서 구현합니다.
- 다이얼로그 open state는 한 곳에서만 관리합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 다이얼로그 열기**
   - 생성 버튼 클릭
   - 다이얼로그 표시

2. **정상 시나리오: 다이얼로그 닫기**
   - 취소 또는 overlay 클릭
   - open state가 false로 바뀜

3. **실패 시나리오: 상태 중복**
   - page와 dialog 내부에서 서로 다른 open state를 관리
   - UI 테스트가 일관된 닫힘 동작을 보장해야 함

## 🚀 6. 권장 작업 순서

1. 생성 버튼 위치를 페이지에 고정합니다.
2. 다이얼로그 shell을 작성합니다.
3. open/close 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 생성 버튼과 다이얼로그 shell이 연결된다.
- [ ] 열기/닫기 상태가 한 곳에서 관리된다.
- [ ] 후속 태스크용 성공 콜백 연결점이 마련된다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 생성 다이얼로그 흐름을 추가`
