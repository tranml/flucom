import { View, FlatList } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioCard from "../components/AudioCard";
import { getMediaType, media } from "../lib/media-data";
import VideoCard from "../components/VideoCard";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={media}
          renderItem={({ item }) =>
            getMediaType(item) === "video" ? (
              <VideoCard media={item} />
            ) : (
              <AudioCard media={item} />
            )
          }
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
