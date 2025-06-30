import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import MediaPlayer from "../components/MediaPlayer";

import { useEventListener } from "expo";
import { Media } from "../types";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { media } from "../lib/media-data";

const media1 = media[1];

export default function MediaPlayerScreen() {
  const [mediaSource, setMediaSource] = useState<string>("");

  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
    // player.play();
  });

  useEventListener(mediaPlayer, "timeUpdate", (event) => {
    console.log("Current time: ", event.currentTime);
  });

  useEffect(() => {
    const mediaPath = getLocalMediaPath(media1);
    console.log("mediaPath", mediaPath);
    setMediaSource(mediaPath);
  }, [media1]);

  const getLocalMediaPath = (media: Media) => {
    return FileSystem.documentDirectory + media.id + ".mp4";
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
      <Stack.Screen options={{ title: "Media Player" }} />
    </View>
  );
}
