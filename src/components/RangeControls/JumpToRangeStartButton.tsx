import { TouchableOpacity, Text } from "react-native";

type JumpToRangeStartButtonProps = {
  onJumpToRangeStart: () => void;
};

export const JumpToRangeStartButton = ({
  onJumpToRangeStart,
}: JumpToRangeStartButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#34C759",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      }}
      onPress={onJumpToRangeStart}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Jump to Point A</Text>
    </TouchableOpacity>
  );
};
