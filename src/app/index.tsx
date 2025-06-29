import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function App() {
  return (
    <View>
      <Text>Welcome to Flucom</Text>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </View>
  );
}