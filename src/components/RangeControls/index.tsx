import { View } from "react-native";
import { RangeDisplay } from "./RangeDisplay";
import { RangeButton } from "./RangeButton";
import { ResetButton } from "./ResetButton";

interface RangeControlsProps {
  // State
  rangeStart: number | null;
  rangeEnd: number | null;
  isRangeMode: boolean;
  isPlaying?: boolean;
  
  // Handlers
  handleRangeButtonPress: () => void;
  handlePlayRange: () => void;
  handleResetRange: () => void;
  handlePlayPause?: () => void;
  
  // UI helpers
  isRangeButtonDisabled: boolean;
  getRangeButtonText: () => string;
  getRangeDisplayText: () => string;
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
      />
      
      <ResetButton
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onReset={handleResetRange}
      />
    </View>
  );
};