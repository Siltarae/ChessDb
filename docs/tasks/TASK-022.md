# 📋 개별 작업 지침서: 초안 자동 저장 및 복원 (TASK-022)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-063]` (GameRecord 스키마), `[TASK-020]`  
**후속 작업**: `[TASK-024]`  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 메모리(Zustand) 상에는 데이터가 존재하나, 브라우저를 닫으면 모든 입력 내용이 유실됩니다.
- **이 작업의 책임**: 착수나 메타데이터 입력이 발생할 때마다 `localStorage`에 상태를 동기화하고, 앱 재진입 시 이를 자동으로 복구하는 로직을 구현합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 실수로 페이지를 새로고침하더라도, 마지막으로 입력하던 보드 상태와 코멘트가 그대로 유지됩니다.
- **성공 기준 (AC)**:
  - 상태 변경 후 1초 이내에 `localStorage`에 저장이 완료되어야 한다.
  - 앱 시작 시 `localStorage` 데이터를 `GameRecordSchema`로 검증한 후 복원한다.

## 📂 2. 대상 아티팩트

- **수정 대상**:
  - `apps/web/src/store/useChessStore.ts`: 미들웨어 또는 구독 로직 추가.
  - `apps/web/src/providers/StoreInitializer.tsx`: 초기 복원 로직 구현.

## 🛠️ 3. 상세 기술 사양

- **자동 저장(Auto-save)**:
  - Zustand의 `subscribe` 기능을 활용하여 `history`, `metadata` 변경 시 `localStorage.setItem` 호출.
  - **디바운스(Debounce)**: 불필요한 IO를 줄이기 위해 500ms~1s 정도의 디바운스를 적용합니다.
- **복원 및 검증**:
  - `localStorage.getItem`으로 읽어온 JSON을 `JSON.parse` 후 `GameRecordSchema.safeParse`로 검증.
  - 검증 실패 시(스키마 변경 등) 과감히 데이터를 버리고 초기 상태로 시작하여 앱 크래시 방지.
- **권장 네이밍**:
  - `LOCAL_STORAGE_DRAFT_KEY = 'chess-db-draft'`
  - `persistDraftToStorage`: 저장 로직 함수.
  - `loadDraftFromStorage`: 복원 로직 함수.

## ⚖️ 4. 기술 제약 및 규칙

- **보안**: 민감한 정보는 저장하지 않으며, 오직 공개된 기보 데이터만 다룹니다.
- **안정성**: `JSON.parse` 호출 시 반드시 `try-catch` 블록을 사용합니다.

## ✅ 7. 완료 판정 체크리스트

- [ ] 수 이동 또는 코멘트 작성 후 새로고침 시 데이터가 완벽히 복구된다.
- [ ] 비정상적인 데이터가 로컬 스토리지에 있을 경우 에러 없이 초기화 상태로 대체된다.
- [ ] `shared` 패키지의 Zod 스키마를 통해 복원 데이터의 무결성을 확인한다.

## 💬 9. 추천 커밋 메시지

- `feat: localStorage 기반 초안 자동 저장 및 복원 기능 구현 (TASK-022)`
