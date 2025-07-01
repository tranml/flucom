import { View } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer } from "expo-video";
import MediaPlayer from "../../components/MediaPlayer";

import { useEventListener } from "expo";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { media } from "../../lib/media-data";

import { useLocalSearchParams } from "expo-router";

import { asGetData, asStoreData } from "../../utils/handleAsyncStorage";

import { formatTime } from "../../utils/formatTime";

export default function MediaPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theMedia = media.find((m) => m.id === id);

  const [mediaSource, setMediaSource] = useState<string>("");

  // Range management
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [isSettingPointB, setIsSettingPointB] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
    // player.play();
  });

  const lastStoredTimeRef = useRef<number>(0);

  // Phase 1: Validation logic for range selection
  const isCurrentTimeValidForPointB = (): boolean => {
    if (!rangeStart) return false;
    return currentTime > rangeStart + 1; // At least 1 second difference
  };

  useEventListener(mediaPlayer, "timeUpdate", (event) => {
    const currentTime = event.currentTime;
    const timeSinceLastStore = currentTime - lastStoredTimeRef.current;

    if (timeSinceLastStore < 5) return;

    asStoreData("last-stored-time--media-" + id, currentTime.toString());
    lastStoredTimeRef.current = currentTime;
  });

  useEffect(() => {
    const mediaPath = getLocalMediaPath(id);
    setMediaSource(mediaPath);

    if (!mediaPlayer) return;

    asGetData("last-stored-time--media-" + id).then((time) => {
      if (time) {
        mediaPlayer.currentTime = Number.parseInt(time);
      }
    });
  }, [id, mediaPlayer]);

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
