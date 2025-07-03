import { View } from "react-native";
import { RangeDisplay } from "./RangeDisplay";
import { RangeButton } from "./RangeButton";
import { ResetButton } from "./ResetButton";
import { ResetPointAButton } from "./ResetPointAButton";

type RangeControlsProps = {
  rangeStart: number | null;
  rangeEnd: number | null;
  isRangeMode: boolean;
  isPlaying?: boolean;
  handleRangeButtonPress: () => void;
  handlePlayRange: () => void;
  handleResetRange: () => void;
  handlePlayPause?: () => void;
  isRangeButtonDisabled: boolean;
  getRangeButtonText: () => string;
  getRangeDisplayText: () => string;
  isSettingPointB: boolean;
  handleResetPointA: () => void;
  handleJumpToRangeStart: () => void;
}

export const RangeControls = ({
  rangeStart,
  rangeEnd,
  isRangeMode,
  isPlaying,
  handleRangeButtonPress,
  handlePlayRange,
  handleResetRange,
  handlePlayPause,
  isRangeButtonDisabled,
  getRangeButtonText,
  getRangeDisplayText,
  isSettingPointB,
  handleResetPointA,
  handleJumpToRangeStart,
}: RangeControlsProps) => {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <RangeDisplay getRangeDisplayText={getRangeDisplayText} />
      
      <RangeButton
        isRangeMode={isRangeMode}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        isRangeButtonDisabled={isRangeButtonDisabled}
        getRangeButtonText={getRangeButtonText}
        onRangeButtonPress={handleRangeButtonPress}
        onPlayRange={handlePlayRange}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        handleJumpToRangeStart={handleJumpToRangeStart}
      />

      {/* Show Reset Point A button when setting point B */}
      {isSettingPointB && (
        <ResetPointAButton onResetPointA={handleResetPointA} />
      )}
      
      <ResetButton
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onReset={handleResetRange}
      />
    </View>
  );
};