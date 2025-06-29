import { View, FlatList } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { media } from "../lib/media-data";
import MediaCard from "../components/MediaCard";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={media}
          renderItem={({ item }) => <MediaCard media={item} />}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
