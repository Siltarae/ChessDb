# 📋 개별 작업 지침서: Husky 및 lint-staged 커밋 훅 연결 (TASK-068)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-067]`  
**후속 작업**: 없음 (로컬 환경 인프라 완료)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 포맷터와 린터는 존재하지만, 개발자가 자발적으로 실행하지 않으면 여전히 린트 위반 코드가 저장소에 커밋될 수 있습니다.
- **이 작업의 책임**: 커밋 시점(`pre-commit`)에 변경된 파일만 자동으로 린트 및 포맷팅하도록 Git Hook을 강제합니다.
- **이번 작업에서 하지 않는 것**: 푸시 단계 검증(`pre-push`)이나 커밋 메시지 규칙(`commitlint`)은 복잡도를 고려해 당장 적용하지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 개발자가 `git commit`을 입력하면 자동으로 포맷이 교정되고, 린트 오류가 남은 파일은 커밋이 차단됩니다.
- **이번 작업의 최소 결과물**:
  - `.husky/pre-commit` 실행 파일
  - `package.json`의 `lint-staged` 설정 구문
- **성공 기준 (AC)**:
  - Staged 상태인 파일에 대해서만 빠르고 선별적으로 검사가 수행되어야 한다.
  - 품질 기준을 통과하지 못한 코드는 커밋 생성이 실패해야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `.husky/pre-commit`
- **수정 대상**:
  - `package.json` (루트): 의존성 설치, `prepare` 스크립트 및 `lint-staged` 섹션 추가

## 🛠️ 3. 상세 기술 사양

- **외부 의존성**:
  - `husky`, `lint-staged`
- **lint-staged 룰 (`package.json` 하위 속성)**:
  ```json
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,scss,yaml,yml}": [
      "prettier --write"
    ]
  }
  ```

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**: 변경되지 않은 전체 코드를 스캔하지 않고 수정된 파일에 한정하여 검사 속도를 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 자동 포맷팅과 커밋 진행**
   - 띄어쓰기가 무너진 정상 로직 코드를 `git add` 후 커밋 시도.
   - 커밋 성공과 함께 파일 내용이 Prettier 기준으로 정렬됨을 확인.
2. **실패 시나리오: 린트 오류 시 차단**
   - 치명적인 ESLint 문법 에러 코드를 포함하여 커밋 시도.
   - 커밋이 취소되며 어떤 파일에서 오류가 발생했는지 터미널에 노출됨을 확인.

## 🚀 6. 권장 작업 순서

1. `pnpm add -wD husky lint-staged` 설치.
2. `pnpm exec husky init` 실행하여 `.husky` 폴더와 기본 훅 스크립트 생성.
3. `.husky/pre-commit` 내용을 `pnpm exec lint-staged` 로 대체.
4. `package.json`에 `lint-staged` 룰 블록 추가.
5. 임의의 파일 수정 후 커밋을 시도하여 동작 검증 (검증 후 리셋).

## ✅ 7. 완료 판정 체크리스트

- [ ] `husky` 및 `lint-staged`가 `devDependencies`에 존재한다.
- [ ] `.husky/pre-commit` 훅이 `lint-staged`를 호출하도록 구성되었다.
- [ ] `package.json`에 파일별로 포맷터와 린터 규칙이 올바르게 명시되었다.


## 💬 9. 추천 커밋 메시지

- `feat: Husky 및 lint-staged 커밋 훅 연결 (TASK-068)`
