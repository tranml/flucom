import { Text } from "react-native";
import { formatTime } from "../../utils/formatTime";

interface RangeDisplayProps {
  rangeStart: number | null;
  rangeEnd: number | null;
}

export const RangeDisplay = ({ rangeStart, rangeEnd }: RangeDisplayProps) => {
  const getRangeDisplayText = (): string => {
    if (!rangeStart || !rangeEnd) return "";
    return `Range: ${formatTime(rangeStart)} - ${formatTime(rangeEnd)}`;
  };


  return (
    <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
      {getRangeDisplayText()}
    </Text>
  );
};
