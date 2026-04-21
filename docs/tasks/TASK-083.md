# 📋 개별 작업 지침서: apps/web React + Vite 프로젝트 초기화 (TASK-083)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]` (워크스페이스 초기화)  
**후속 작업**: `[TASK-084]` (Tailwind/shadcn)  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 루트 구조는 잡혀 있으나 `apps/web` 디렉토리는 비어있거나 생성되지 않은 상태입니다.
- **이 작업의 책임**: Vite를 사용하여 최신 React + TypeScript 환경을 구축하고, 모노레포의 일원으로 패키지를 등록합니다.

- **이번 작업에서 하지 않는 것**: `[TASK-084]` (Tailwind/shadcn)에 연결된 후속 책임은 이번 태스크에서 함께 닫지 않는다.

- **경계 메모**:
  - 이번 태스크는 apps/web React + Vite 프로젝트 초기화 범위만 닫고, 후속 태스크 또는 인접 Feature의 세부 구현은 여기서 함께 처리하지 않는다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter web dev` 명령어로 개발 서버를 실행하고 브라우저에서 초기 화면을 확인할 수 있습니다.
- **성공 기준 (AC)**:
  - Vite의 표준 프로젝트 구조를 갖춘다.
  - 루트의 `tsconfig.base.json`을 상속받아 타입 설정을 공유한다.
  - 패키지명이 `@chess-db/web`으로 정확히 명시되어야 한다.

- **이번 작업의 최소 결과물**:
  - `apps/web/package.json`
  - `apps/web/tsconfig.json`
  - `apps/web/index.html`

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/package.json`
  - `apps/web/tsconfig.json`
  - `apps/web/index.html`
  - `apps/web/src/main.tsx`

- **수정 대상**:
  - `apps/web/package.json`
  - `apps/web/tsconfig.json`
  - `apps/web/index.html`

- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **이번 작업에서 수정하지 않음**:
  - `[TASK-084]` (Tailwind/shadcn)에 연결된 후속 책임 파일

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **프로젝트 생성**: `pnpm create vite web --template react-ts` (apps 폴더 내에서 실행 권장)
- **TypeScript 설정**:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "jsx": "react-jsx",
      "baseUrl": ".",
      "paths": { "@/*": ["./src/*"] }
    }
  }
  ```
- **모노레포 연동**: `package.json`의 `name`을 `@chess-db/web`으로 설정하고 루트 `pnpm-workspace.yaml` 확인.
- **필수 describe/it 목록**:
  - describe: `Vite Application Bootstrapping`
    - it: `개발 서버가 에러 없이 구동되어야 한다`
    - it: `루트의 공통 TypeScript 규칙이 적용되어야 한다`

- **핵심 조립/흐름 규칙**:
  - `apps/web` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
  - Vite 개발 서버가 정상 구동되며 HMR이 작동한다.
  - 절대 경로(`@/*`) 설정이 IDE와 빌드 도구에서 모두 인식된다.

- **데이터 모델 해석**:
  - 이 태스크는 앱 코드보다 Vite/React 프로젝트 초기 파일과 엔트리 경로 계약이 핵심입니다.
  - 입력은 `apps/web` 루트의 package/script/entry 구성이며, 출력은 실행 가능한 React 앱 스캐폴드입니다.

- **외부 의존성**:
  - `react`
  - `vite`
  - `typescript`

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: apps/web React + Vite 프로젝트 초기화 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `main.tsx`, `App` 또는 `router` entry 이름은 웹 앱 진입 계약을 드러낼 때 사용합니다.
  - `@chess-db/web` 패키지명은 workspace 식별자로 유지합니다.

- **인수 이름 가이드**:
  - `entry`, `root`, `outDir`

- **짧은 예시 골격**:

```ts
pnpm create vite apps/web --template react-ts
```

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - 루트 workspace 스크립트와 web 앱 스크립트가 맞지 않는 경우
  - 앱 진입 파일 경로가 아키텍처 문서와 어긋나는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**:
  - 전역 규칙을 반복 나열하지 말고, 이번 태스크에서 특히 강조해야 하는 제약만 짧게 적는다.

- **구조 규칙**:
  - 현재 디렉토리 구조와 연관 설계 문서의 책임 경계를 유지한다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-084]` (Tailwind/shadcn)에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 핵심 동작 확인**
   - `apps/web` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
   - 요구사항 문서의 완료 기준이 코드 또는 테스트에서 직접 확인되어야 한다.

2. **실패 시나리오: 범위 침범 차단**
   - `apps/web`이 독립 실행 가능한 React + Vite 앱이어야 한다.
   - 루트 워크스페이스에서 필터 실행이 가능해야 한다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. **문맥 확인**: `[../architecture/tech-stack.md]`, `[../architecture/directory-structure.md]`
2. **입력 자산 확인**: 이번 태스크가 기대하는 타입, 상수, helper, 화면 구조, API 진입점이 이미 준비됐는지 확인한다.
3. **핵심 구현**: apps/web React + Vite 프로젝트 초기화 범위의 핵심 로직, 화면, 타입, 문서 또는 테스트를 작성한다.
4. **연동**: 공개 export, 소비 코드, 테스트 연결, 후속 태스크가 기대하는 연결점을 맞춘다.
5. **검증 실행**:
   - `pnpm --filter @chess-db/web build`
   - `pnpm --filter @chess-db/web test`
6. **자가 점검**: 범위 침범, 수정 금지 파일 변경, 링크 경로, 후속 태스크와의 책임 충돌 여부를 점검한다.

## ✅ 7. 완료 판정 체크리스트

- [ ] `apps/web` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
- [ ] Vite 개발 서버가 정상 구동되며 HMR이 작동한다.
- [ ] 절대 경로(`@/*`) 설정이 IDE와 빌드 도구에서 모두 인식된다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web React + Vite 프로젝트 초기화 (TASK-083)`
