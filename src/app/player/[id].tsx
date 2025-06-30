import { View } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer } from "expo-video";
import MediaPlayer from "../../components/MediaPlayer";

import { useEventListener } from "expo";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { media } from "../../lib/media-data";

import { useLocalSearchParams } from "expo-router";

export default function MediaPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theMedia = media.find((m) => m.id === id);

  const [mediaSource, setMediaSource] = useState<string>("");

  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
    player.play();
  });

  useEventListener(mediaPlayer, "timeUpdate", (event) => {
    console.log("Current time: ", event.currentTime);
  });

  useEffect(() => {
    const mediaPath = getLocalMediaPath(id);
    console.log("mediaPath", mediaPath);
    setMediaSource(mediaPath);
  }, [id]);

  const getLocalMediaPath = (id: string) => {
    return FileSystem.documentDirectory + id + ".mp4";
  };

  if (!mediaSource) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View>
      <MediaPlayer mediaPlayer={mediaPlayer} />
      <Stack.Screen options={{ title: theMedia?.title }} />
    </View>
  );
}
