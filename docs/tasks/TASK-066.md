# 📋 개별 작업 지침서: 전역 TypeScript 베이스 설정 작성 (TASK-066)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`  
**후속 작업**: `[TASK-067]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 구조만 잡혀 있고, TypeScript 컴파일러 설정 파일이 없어 TS 파일 해석 기준이 없는 상태입니다.
- **이 작업의 책임**: 모든 하위 패키지(React, NestJS, Shared)가 공통으로 상속(`extends`)받을 수 있는 엄격하고 일관된 TypeScript 베이스 설정(`tsconfig.base.json`)을 작성합니다.
- **이번 작업에서 하지 않는 것**: 각 앱이나 패키지별 구체적인 `tsconfig.json`은 작성하지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 루트에 TS 베이스 설정이 마련되어, 이후 하위 패키지에서 중복된 설정 없이 일관된 타입 체크를 적용받을 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `tsconfig.base.json` (루트)
- **성공 기준 (AC)**:
  - `strict: true` 등 필수 엄격한 규칙이 포함되어야 한다.
  - 최신 ECMAScript 모듈 및 번들러(Vite/NestJS) 호환 설정이 명시되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `tsconfig.base.json`
- **수정 대상**:
  - 없음

## 🛠️ 3. 상세 기술 사양

- **핵심 조립/흐름 규칙**:
  - 하위 프로젝트는 각자의 폴더에서 `"extends": "../../tsconfig.base.json"`으로 이 파일을 확장합니다.
- **컴파일러 옵션 필수 항목**:
  - `target`: `"ESNext"`
  - `module`: `"ESNext"`
  - `moduleResolution`: `"bundler"`
  - `strict`: `true`
  - `esModuleInterop`: `true`
  - `skipLibCheck`: `true`
  - `forceConsistentCasingInFileNames`: `true`
  - `isolatedModules`: `true`

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**: 모노레포와 최신 빌드 도구에 친화적인 설정을 유지하여 하위 패키지에서 재정의하는 수고를 덜어줍니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: JSON 파싱 및 유효성 확인**
   - 에디터에서 해당 파일의 JSON 스키마 오류나 구문 경고가 없어야 합니다.

## 🚀 6. 권장 작업 순서

1. 루트 디렉토리에 `tsconfig.base.json` 생성.
2. 명시된 필수 `compilerOptions`를 모두 포함하여 작성.
3. 파일 저장 후 에디터 구문 검사 확인.

## ✅ 7. 완료 판정 체크리스트

- [ ] `tsconfig.base.json`이 올바른 JSON 포맷으로 작성되었다.
- [ ] `strict: true`가 명시되었다.
- [ ] 모듈 해결 방식이 `bundler` 등 모던 환경에 맞춰 설정되었다.
