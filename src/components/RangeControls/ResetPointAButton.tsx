import { TouchableOpacity, Text } from "react-native";

type ResetPointAButtonProps = {
  onResetPointA: () => void;
};

export const ResetPointAButton = ({
  onResetPointA,
}: ResetPointAButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FF9500",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      }}
      onPress={onResetPointA}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Reset Point A</Text>
    </TouchableOpacity>
  );
};
