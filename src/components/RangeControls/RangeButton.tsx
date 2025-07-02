import { TouchableOpacity, Text } from "react-native";

interface RangeButtonProps {
  isRangeMode: boolean;
  isRangeButtonDisabled: boolean;
  rangeStart: number | null;
  rangeEnd: number | null;
  getRangeButtonText: () => string;
  onRangeButtonPress: () => void;
  onPlayRange: () => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export const RangeButton = ({
  isRangeMode,
  rangeStart,
  rangeEnd,
  isRangeButtonDisabled,
  getRangeButtonText,
  onRangeButtonPress,
  onPlayRange,
  isPlaying,
  onPlayPause,
}: RangeButtonProps) => {
  if (isRangeMode) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          flex: 1,
        }}
        onPress={onPlayPause}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: isRangeButtonDisabled ? "#ccc" : "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      }}
      onPress={rangeStart && rangeEnd ? onPlayRange : onRangeButtonPress}
      disabled={isRangeButtonDisabled}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        {getRangeButtonText()}
      </Text>
    </TouchableOpacity>
  );
};
