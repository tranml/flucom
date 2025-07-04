import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { JumpToRangeStartButton } from "./JumpToRangeStartButton";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

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
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          {!isPlaying && (
            <Link href="/camera" asChild>
              <Pressable style={styles.cameraButton}>
                <MaterialIcons name="photo-camera" size={30} color="white" />
              </Pressable>
            </Link>
          )}

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
        </View>
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

const styles = StyleSheet.create({
  cameraButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
});
