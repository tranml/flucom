import { Text } from "react-native";

type RangeDisplayProps = {
  getRangeDisplayText: () => string;
}

export const RangeDisplay = ({ getRangeDisplayText }: RangeDisplayProps) => {

  return (
    <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
      {getRangeDisplayText()}
    </Text>
  );
};
