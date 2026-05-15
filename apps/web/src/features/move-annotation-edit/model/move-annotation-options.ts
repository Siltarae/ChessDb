import { MOVE_ANNOTATION, type MoveAnnotation } from '@chess-db/shared';

export type MoveAnnotationOption = {
  readonly annotation: MoveAnnotation;
  readonly label: string;
  readonly ariaLabel: string;
};

export const moveAnnotationOptions: readonly MoveAnnotationOption[] = [
  {
    annotation: MOVE_ANNOTATION.BRILLIANT,
    label: '!!',
    ariaLabel: '매우 좋은 수',
  },
  {
    annotation: MOVE_ANNOTATION.GOOD,
    label: '!',
    ariaLabel: '좋은 수',
  },
  {
    annotation: MOVE_ANNOTATION.INTERESTING,
    label: '!?',
    ariaLabel: '흥미로운 수',
  },
  {
    annotation: MOVE_ANNOTATION.DUBIOUS,
    label: '?!',
    ariaLabel: '의문이 있는 수',
  },
  {
    annotation: MOVE_ANNOTATION.MISTAKE,
    label: '?',
    ariaLabel: '실수',
  },
  {
    annotation: MOVE_ANNOTATION.BLUNDER,
    label: '??',
    ariaLabel: '큰 실수',
  },
];
