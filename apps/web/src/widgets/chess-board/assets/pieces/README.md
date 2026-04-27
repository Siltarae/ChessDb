# 체스 기물 SVG 자산

이 폴더의 체스 기물 SVG는 Wikimedia Commons의 `SVG chess pieces` 카테고리에서 받은 Cburnett 표준 체스 기물 세트를 프로젝트 파일명 규칙에 맞게 저장한 것이다.

## 출처

- 출처 카테고리: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
- 원본 세트: Wikimedia Commons `SVG chess pieces/Standard transparent`
- 원작자: Cburnett
- 다운로드 날짜: 2026-04-27
- 배경: 투명 배경 SVG
- 프로젝트 내 수정: 파일명을 프로젝트 규칙에 맞게 변경했다. SVG 도형 자체는 의도적으로 수정하지 않는다.

## 라이선스

각 원본 파일 설명 페이지는 여러 라이선스 중 하나를 선택할 수 있다고 안내한다. 이 프로젝트에서는 해당 파일들의 라이선스 중 **BSD 3-Clause License** 조건을 기준으로 사용한다.

Wikimedia Commons 원본 파일 페이지에서 확인한 라이선스 후보:

- GNU Free Documentation License 1.2 or later
- Creative Commons Attribution-ShareAlike 3.0 Unported
- BSD License
- GNU General Public License 2.0 or later

사용 시에는 원작자 표기와 원본 출처 링크를 유지한다.

## 파일 매핑

| 프로젝트 파일      | Wikimedia Commons 원본 파일 |
| ------------------ | --------------------------- |
| `white-king.svg`   | `Chess klt45.svg`           |
| `white-queen.svg`  | `Chess qlt45.svg`           |
| `white-rook.svg`   | `Chess rlt45.svg`           |
| `white-bishop.svg` | `Chess blt45.svg`           |
| `white-knight.svg` | `Chess nlt45.svg`           |
| `white-pawn.svg`   | `Chess plt45.svg`           |
| `black-king.svg`   | `Chess kdt45.svg`           |
| `black-queen.svg`  | `Chess qdt45.svg`           |
| `black-rook.svg`   | `Chess rdt45.svg`           |
| `black-bishop.svg` | `Chess bdt45.svg`           |
| `black-knight.svg` | `Chess ndt45.svg`           |
| `black-pawn.svg`   | `Chess pdt45.svg`           |

## 사용 규칙

- 외부 URL로 직접 참조하지 않고 로컬 asset으로 import한다.
- `ChessPiece`에서 shared 도메인 모델의 색상과 기물 타입을 이 파일명에 매핑한다.
- 기물 선택, 드래그, 합법 수 하이라이트 상태는 이 asset 폴더의 책임이 아니다.
