import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "red", padding: 16 }}>
        <Text>Welcome to Flucom</Text>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
