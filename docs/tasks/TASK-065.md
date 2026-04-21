# 📋 개별 작업 지침서: Turborepo 설치 및 turbo.json 설정 (TASK-065)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`  
**후속 작업**: `[TASK-066]`, `[TASK-067]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `pnpm` 워크스페이스 루트가 초기화되었으나(`package.json`, `pnpm-workspace.yaml`), 다중 패키지 빌드나 린트를 조율할 파이프라인 도구는 없는 상태입니다.
- **이 작업의 책임**: 모노레포 환경에서 캐싱과 병렬 실행을 지원하는 `Turborepo`를 설치하고, 전역 `turbo.json` 파이프라인을 구축합니다.
- **이번 작업에서 하지 않는 것**: 하위 패키지의 `build`, `lint` 스크립트를 실제로 실행하거나 검증하지 않습니다(아직 하위 패키지가 없음).
- **경계 메모**:
  - 이후 모든 전역 스크립트 실행은 `pnpm turbo run <task>` 형태로 통합됩니다.

## 🎯 1. 작업 목표

- **최종 상태**: `turbo.json` 파이프라인 정의가 완료되어, 향후 하위 패키지들이 추가되면 즉시 병렬 빌드 및 린트가 가능한 상태가 됩니다.
- **이번 작업의 최소 결과물**:
  - `turbo.json` 생성
  - 루트 `package.json`에 `turbo` 패키지 추가 및 스크립트 등록
- **성공 기준 (AC)**:
  - `turbo.json` 스키마 오류가 없어야 한다.
  - `build`, `lint`, `test`, `dev` 파이프라인이 정의되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `turbo.json`: 파이프라인 캐싱 및 의존성 정의
- **수정 대상**:
  - `package.json` (루트): `devDependencies` 추가 및 `scripts` 변경
- **이번 작업에서 수정하지 않음**:
  - `pnpm-workspace.yaml`: 이미 설정 완료됨

- **조건부 정리 대상**: 필요할 때만 작성
  - placeholder, 임시 스켈레톤, 중복 export, 오래된 경로 표기

- **아티팩트 작성 규칙**:
  - 가능한 한 실제 파일 경로를 기준으로 작성하고, 범위 밖 파일은 이유 없이 함께 수정하지 않는다.
  - 수정 금지 범위나 후속 태스크 책임 파일은 이 섹션에서 명시적으로 분리한다.

## 🛠️ 3. 상세 기술 사양

- **핵심 조립/흐름 규칙**:
  - `build`: 패키지 간 의존성을 고려하여 순차적/병렬로 실행 (`dependsOn: ["^build"]`)
  - `lint`: 의존성 없이 병렬 실행
  - `dev`: 캐시를 사용하지 않고 지속 실행 (`cache: false`, `persistent: true`)
- **외부 의존성**:
  - `turbo` (최신 버전, devDependency)
- **짧은 예시 골격**:

  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**"]
      },
      "lint": {},
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }
  ```

- **데이터 모델 해석**:
  - 이 태스크의 핵심 데이터는 앱 코드가 아니라 워크스페이스 패키지 그래프와 파이프라인 task 관계입니다.
  - 입력은 루트 스크립트, 워크스페이스 구조, 캐시 대상 작업 목록입니다.

- **import/export 규칙**:
  - `../architecture/project-rules.md`의 named export, 상대 경로 최소화, `.js` 확장자 규칙을 따른다.

- **권장 네이밍**:
  - 공개 함수/타입 이름: Turborepo 설치 및 turbo.json 설정 책임이 드러나는 이름
  - 내부 helper 이름: 역할이 바로 드러나는 동사형 또는 조합형 이름
  - 핵심 변수명: 상태와 대상이 분명한 이름
  - 피해야 할 이름: data, item, obj, temp

- **이름별 사용 의도와 적용 시점**:
  - `build`, `lint`, `test`, `type-check` task 이름은 이후 앱/패키지가 공통으로 재사용할 계약입니다.
  - `dependsOn`은 파이프라인 선후 관계를 드러낼 때 사용합니다.

- **인수 이름 가이드**:
  - `taskName`, `dependsOn`, `outputs`

- **필수 describe/it 목록**:
  - 최상위 describe: `Turborepo 설치 및 turbo.json 설정`
  - 필수 it: 요구사항 문서의 완료 기준을 직접 검증하는 테스트

- **최소 테스트 개수**:
  - 최소 3개

- **반드시 포함할 실패 시나리오**:
  - 패키지별 스크립트명과 turbo task명이 어긋나는 경우
  - 캐시 대상 산출물 경로를 빠뜨리는 경우

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**: 공식 Turborepo 권장 설정을 따릅니다.
- **구조 규칙**: 루트에만 설치하며 전역 컨텍스트를 유지합니다.

- **불변성/상태 규칙**:
  - 기존 상태를 직접 오염시키지 않고, 이번 태스크의 책임 범위 안에서 상태를 갱신한다.

- **범위 규칙**:
  - `[TASK-066]`, `[TASK-067]`에 연결된 범위는 여기서 닫지 않는다.

- **헌법 정렬 규칙**:
  - `../architecture/project-rules.md`의 네이밍, import/export, 상태 규칙을 그대로 따른다.

- **문서화 규칙**:
  - 이 문서에서 고정한 파일 경로, 검증 기준, 후속 태스크 경계를 구현 단계와 동일하게 유지한다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: turbo 설치 및 파이프라인 인식**
   - `pnpm turbo run lint` 실행
   - 아직 실행할 패키지 스크립트가 없더라도, 파이프라인 캐시 시스템 자체가 정상적으로 구동됨을 확인해야 합니다.

- **검증 시나리오 작성 규칙**:
  - 정상 흐름과 반려 흐름을 함께 적고, 가능하면 현재 테스트 파일 또는 후속 테스트 포인트와 연결한다.

## 🚀 6. 권장 작업 순서

1. `pnpm add -wD turbo` 실행.
2. 루트에 `turbo.json` 생성 후 `$schema` 및 `tasks` 정의.
3. 루트 `package.json`의 `scripts` 영역에 `"build": "turbo run build"`, `"lint": "turbo run lint"` 등 공통 스크립트 연결.
4. 실행 검증.

## ✅ 7. 완료 판정 체크리스트

- [ ] `turbo` 패키지가 루트 `devDependencies`에 존재한다.
- [ ] `turbo.json`이 정상적인 포맷으로 작성되었다.
- [ ] 파이프라인(`build`, `lint`, `dev` 등)이 올바르게 정의되었다.

## 💬 9. 추천 커밋 메시지

- `chore: Turborepo 설치 및 turbo.json 설정 (TASK-065)`
