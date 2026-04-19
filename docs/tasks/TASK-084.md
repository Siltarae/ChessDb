# 📋 개별 작업 지침서: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 (TASK-084)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]`  
**후속 작업**: `[TASK-085]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 🛠️ 3. 상세 기술 사양

- **Tailwind 설치**: `tailwindcss`, `postcss`, `autoprefixer` 설치 및 `npx tailwindcss init -p` 실행.
- **shadcn/ui 초기화**: `npx shadcn-ui@latest init` 실행.
  - Style: New York (또는 Default)
  - Base Color: Slate (또는 Zinc)
  - CSS Variables: Yes
- **경로 별칭**: `components.json`과 `vite.config.ts`에서 `@/*` 경로가 `src/*`를 가리키도록 설정 확인.

## ✅ 4. 완료 판정 체크리스트

- [ ] Tailwind CSS 지시어(`@tailwind base;` 등)가 `globals.css`에 포함되었다.
- [ ] `shadcn/ui` 초기화 결과로 `src/components/ui` 폴더와 `lib/utils.ts`가 생성되었다.
- [ ] 간단한 버튼 컴포넌트를 추가하여 스타일이 정상 적용되는지 확인했다.


## 💬 9. 추천 커밋 메시지

- `feat: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 (TASK-084)`
