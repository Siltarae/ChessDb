# TASK-086 packages/shared 공통 도메인 패키지 초기화 및 TypeScript 설정

## 상위 Feature

- [FEATURE-001 체스 규칙 및 합법 수 판정 엔진](../features/FEATURE-001.md)

## 목적

- 프론트엔드와 백엔드가 공유할 순수 체스 도메인 로직과 타입 선언을 담을 공통 패키지를 초기화한다.

## 완료 조건

- [ ] `packages/shared` 폴더에 `package.json`이 생성되고 패키지 이름이 지정되어야 한다.
- [ ] 모노레포 루트의 베이스 설정을 상속받는 `tsconfig.json`이 작성되어야 한다.
- [ ] `src/index.ts` 등 진입점이 만들어지고 정상적으로 export 됨을 확인해야 한다.

## 참고 사항

- 실제 체스 도메인 코드는 이후 태스크에서 작성한다.


## 💬 9. 추천 커밋 메시지

- `chore: update TASK-086.md`
