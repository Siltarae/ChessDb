# 📋 개별 작업 지침서: 기보 및 저장소 관련 로컬 스토리지 데이터 스키마 정의 (TASK-063)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-090]`  
**후속 작업**: `[TASK-020]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 브라우저를 새로고침하면 입력 중이던 모든 데이터가 사라집니다.
- **이 작업의 책임**: 서버 저장 전, 사용자의 데이터를 브라우저에 임시로 보관하기 위한 `localStorage` 데이터 구조를 정의하고 Zod 스키마를 작성합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 클라이언트 측에서 기보 초안(Draft)과 오프라인 상태에서의 메타데이터를 일관된 구조로 다룰 수 있습니다.

## 🛠️ 3. 상세 기술 사양

- **스키마 구조**:
  ```ts
  const GameDraftSchema = z.object({
    id: z.string().uuid(),
    gameState: GameStateSchema,
    history: z.array(MoveInfoSchema),
    metadata: z.object({
      comments: z.record(z.string(), z.string()), // Square/Move index -> comment
      annotations: z.record(z.string(), z.string()),
    }),
    updatedAt: z.string().datetime(),
  });
  ```

## ✅ 4. 완료 판정 체크리스트

- [ ] 초안 데이터를 표현하는 Zod 스키마가 `shared` 또는 `web` 패키지에 정의되었다.
- [ ] `localStorage` 키 네이밍 컨벤션이 확립되었다 (예: `chess-db-draft`).


## 💬 9. 추천 커밋 메시지

- `feat: 기보 및 저장소 관련 로컬 스토리지 데이터 스키마 정의 (TASK-063)`
