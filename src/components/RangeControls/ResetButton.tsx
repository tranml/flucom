import { TouchableOpacity, Text } from "react-native";

interface ResetButtonProps {
  rangeStart: number | null;
  rangeEnd: number | null;
  onReset: () => void;
}

export const ResetButton = ({ rangeStart, rangeEnd, onReset }: ResetButtonProps) => {
  if (!rangeStart || !rangeEnd) return null;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FF3B30",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      }}
      onPress={onReset}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Reset Range
      </Text>
    </TouchableOpacity>
  );
};