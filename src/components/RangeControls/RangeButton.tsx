import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { JumpToRangeStartButton } from "./JumpToRangeStartButton";

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
  handleJumpToRangeStart: () => void;
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
  handleJumpToRangeStart,
}: RangeButtonProps) => {
  if (isRangeMode) {
    return (
      <>
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
      <JumpToRangeStartButton onJumpToRangeStart={handleJumpToRangeStart} />
      </>
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
