# 저장소 목록 정렬 옵션 확장

## 상태

- 초안
- 현재 범위 밖 후순위 계획

## 배경

- `TASK-032`의 현재 범위는 저장소 목록의 기본 정렬을 생성 순으로 고정하는 것이다.
- 이름순, 사용자 지정 정렬, 정렬 UI는 현재 범위에서 제외한다.
- 기본 정렬 없이 DB 반환 순서에 기대면 목록 표시 순서가 불안정하므로, 현재는 API 기본값을 `createdAt` 오름차순으로 둔다.
- 여러 정렬 기준이 실제로 필요해질 때 query parameter 기반 API 계약으로 확장한다.

## 목표

- 저장소 목록 API가 기본 정렬과 명시적 정렬 옵션을 모두 안정적으로 지원한다.
- 클라이언트가 허용된 정렬 기준만 사용할 수 있게 한다.
- 잘못된 정렬 기준이나 정렬 방향은 검증 오류로 거절한다.

## API 후보

```http
GET /api/repositories
GET /api/repositories?sort=createdAt&order=asc
GET /api/repositories?sort=name&order=asc
```

## 기본 계약 후보

- query parameter 없음: `createdAt asc`
- `sort` 허용값: `createdAt`, `name`
- `order` 허용값: `asc`, `desc`
- `sort`만 있고 `order` 없음: 기본 `asc`
- 알 수 없는 `sort` 또는 `order`: `400 Validation Error`

## 구현 후보

- 저장소 목록 조회 DTO에 `sort`, `order` query parameter 추가
- service 계층에서 기본값 확정
- repository 계층에서 허용된 정렬값만 Prisma `orderBy`로 변환
- 같은 정렬값이 있을 때 안정 정렬을 위해 보조 기준 추가

```ts
type RepositorySortField = 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';

type FindRepositoriesInput = {
  readonly sort?: RepositorySortField;
  readonly order?: SortOrder;
};
```

```ts
orderBy: [{ [sort]: order }, { id: 'asc' }];
```

## 제외 범위

- `TASK-032`에서 정렬 query parameter 선구현
- 사용처 없는 정렬 UI 선구현
- 이름순 외 고급 정렬 기준 선작성
- 사용자별 정렬 설정 저장

## 승격 조건

- 저장소 목록에서 이름순 또는 최신순 정렬 요구가 생길 때
- 사용자가 목록 정렬 방식을 직접 바꿔야 할 때
- 저장소 수가 늘어나 기본 생성 순만으로 탐색성이 부족해질 때
