export {
  decisiveTerminationReasonOptions,
  drawTerminationReasonOptions,
  gameResultOptions,
  getTerminationReasonOptionsByResult,
  isTerminationReasonAllowedForResult,
} from './model/game-metadata-options';
export { useGameMetadataEdit } from './model/use-game-metadata-edit';
export { GameMetadataEditor } from './ui/game-metadata-editor';
export { GameResultField } from './ui/game-result-field';
export { GameTerminationField } from './ui/game-termination-field';
export type {
  GameResultOption,
  GameTerminationReasonOption,
} from './model/game-metadata-options';
export type { UseGameMetadataEditResult } from './model/use-game-metadata-edit';
