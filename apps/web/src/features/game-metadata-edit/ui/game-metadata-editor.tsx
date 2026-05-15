import { GameResultField } from './game-result-field';
import { GameTerminationField } from './game-termination-field';

export const GameMetadataEditor = () => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">기보 정보</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          결과와 종료 사유는 기보 전체에 연결됩니다.
        </p>
      </div>
      <GameResultField />
      <GameTerminationField />
    </div>
  );
};
