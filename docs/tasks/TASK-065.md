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

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**: 공식 Turborepo 권장 설정을 따릅니다.
- **구조 규칙**: 루트에만 설치하며 전역 컨텍스트를 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: turbo 설치 및 파이프라인 인식**
   - `pnpm turbo run lint` 실행
   - 아직 실행할 패키지 스크립트가 없더라도, 파이프라인 캐시 시스템 자체가 정상적으로 구동됨을 확인해야 합니다.

## 🚀 6. 권장 작업 순서

1. `pnpm add -wD turbo` 실행.
2. 루트에 `turbo.json` 생성 후 `$schema` 및 `tasks` 정의.
3. 루트 `package.json`의 `scripts` 영역에 `"build": "turbo run build"`, `"lint": "turbo run lint"` 등 공통 스크립트 연결.
4. 실행 검증.

## ✅ 7. 완료 판정 체크리스트

- [ ] `turbo` 패키지가 루트 `devDependencies`에 존재한다.
- [ ] `turbo.json`이 정상적인 포맷으로 작성되었다.
- [ ] 파이프라인(`build`, `lint`, `dev` 등)이 올바르게 정의되었다.
