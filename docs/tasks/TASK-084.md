# 📋 개별 작업 지침서: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 (TASK-084)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-085]` (공통 라이브러리)  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 순수 React 프로젝트가 생성되었으나 스타일링 도구 및 UI 컴포넌트 프레임워크가 없는 상태입니다.
- **이 작업의 책임**: 프로젝트 전역에 Tailwind CSS를 설정하고, 고품질 UI 구현을 위한 shadcn/ui를 초기화합니다.

- **이번 작업에서 하지 않는 것**: `[TASK-085]` (공통 라이브러리)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: Tailwind 클래스를 사용하여 스타일을 적용할 수 있으며, shadcn/ui 컴포넌트(Button 등)를 즉시 추가하고 사용할 수 있습니다.

- **이번 작업의 최소 결과물**:
  - `apps/web/components.json`
  - `apps/web/src/app/styles/globals.css`
  - `apps/web/src/shared/ui/button.tsx`
  - `apps/web/src/shared/lib/utils.ts`
  - `apps/web/vite.config.ts` Tailwind Vite 플러그인 연결
- **성공 기준 (AC)**:
  - `globals.css`에 Tailwind v4 전역 import와 shadcn/ui 테마 토큰이 정상 포함되었다.
  - `components.json` 설정 파일이 생성되고 경로 설정이 유효하다.
  - shadcn/ui Button 컴포넌트가 정상적으로 생성되고 스타일이 적용된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/components.json`
  - `apps/web/src/app/styles/globals.css`
  - `apps/web/src/shared/ui/button.tsx`
  - `apps/web/src/shared/ui/button-variants.ts`
  - `apps/web/src/shared/lib/utils.ts`
- **수정 대상**:
  - `apps/web/src/app/styles/globals.css`
  - `apps/web/package.json`
  - `apps/web/vite.config.ts`
  - `apps/web/tsconfig.json`
  - `apps/web/src/main.tsx`
- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-085]` (공통 라이브러리)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **Tailwind 설치**: 최신 공식 Vite 방식에 따라 `tailwindcss`, `@tailwindcss/vite`를 설치하고 `vite.config.ts`에 Tailwind Vite 플러그인을 연결한다.
- **shadcn/ui 초기화**: 최신 공식 CLI인 `pnpm dlx shadcn@latest init` 흐름을 사용한다.
  - Template: Vite
  - Component library: Radix
  - Preset: Nova
  - CSS Variables: Yes
- **Vite 설정 연동**: `vite.config.ts`에서 경로 별칭(`@`) 설정이 Tailwind 및 shadcn 설정과 일치하는지 확인.
- **필수 describe/it 목록**:
  - describe: `Styling Environment`
    - it: `Tailwind 유틸리티 클래스가 실제 DOM 요소에 적용되어야 한다`
    - it: `shadcn/ui 컴포넌트가 프로젝트 규칙에 맞는 위치에 생성되어야 한다`

- **핵심 조립/흐름 규칙**:
  - `globals.css`에 Tailwind v4 전역 import와 shadcn/ui 테마 토큰이 정상 포함되었다.
  - `components.json` 설정 파일이 생성되고 경로 설정이 유효하다.
  - shadcn/ui Button 컴포넌트가 `apps/web/src/shared/ui` 계층에 생성되고 스타일이 적용된다.

- **데이터 모델 해석**:
  - 핵심 데이터는 Tailwind Vite 플러그인 설정, shadcn 설정 파일과 전역 스타일 엔트리입니다.
  - 입력은 web 앱의 스타일 파이프라인이며, 출력은 공통 UI 컴포넌트가 렌더링 가능한 환경입니다.

- **외부 의존성**:
  - `tailwindcss`
  - `@tailwindcss/vite`
  - `shadcn/ui`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `globals.css`는 전역 디자인 토큰과 reset을 담는 파일 이름으로 유지합니다.
  - `components.json`은 shadcn generator 설정 계약입니다.

- **인수 이름 가이드**:
  - `content`, `theme`, `plugins`

- **짧은 예시 골격**:

```ts
export default { content: ['./src/**/*.{ts,tsx}'], theme: { extend: {} } };
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - Tailwind Vite 플러그인이 연결되지 않아 클래스가 빌드 결과에 반영되지 않는 경우
  - shadcn 생성 경로가 directory-structure와 어긋나는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-085]` (공통 라이브러리)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - `globals.css`에 Tailwind v4 전역 import와 shadcn/ui 테마 토큰이 정상 포함되었다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - Tailwind 클래스가 `apps/web` 전체에서 인식되어야 한다.
   - shadcn 생성 기준이 현재 웹 구조와 맞아야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/tech-stack.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/web build`
   - `pnpm --filter @chess-db/web test`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `globals.css`에 Tailwind v4 전역 import와 shadcn/ui 테마 토큰이 정상 포함되었다.
- [ ] `components.json` 설정 파일이 생성되고 경로 설정이 유효하다.
- [ ] shadcn/ui Button 컴포넌트가 `apps/web/src/shared/ui` 계층에 생성되고 스타일이 적용된다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web Tailwind CSS 및 shadcn/ui 스타일링 환경 구축`
