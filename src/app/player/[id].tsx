import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer } from "expo-video";
import MediaPlayer from "../../components/MediaPlayer";

import { useEvent, useEventListener } from "expo";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { media } from "../../lib/media-data";

import { useLocalSearchParams } from "expo-router";

import { asGetData, asStoreData } from "../../utils/handleAsyncStorage";

import { useRangePlayer } from "../../hooks/useRangePlayer";
import { RangeControls } from "../../components/RangeControls";
import { SubtitleEntry } from "../../types";

export default function MediaPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theMedia = media.find((m) => m.id === id);

  const [mediaSource, setMediaSource] = useState<string>("");

  const [currentTime, setCurrentTime] = useState<number>(0);

  // Add state for caching current subtitle
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleEntry | null>(
    null
  );

  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
  });

  // console.log("theMedia?.subtitles", JSON.stringify(theMedia?.subtitles, null, 2));

  const {
    rangeStart,
    rangeEnd,
    isRangeMode,
    handleRangeButtonPress,
    handlePlayRange,
    handleResetRange,
    getRangeButtonText,
    isRangeButtonDisabled,
    getRangeDisplayText,
    handleRangeLogic,
  } = useRangePlayer({
    mediaPlayer,
    currentTime,
  });

  const { isPlaying } = useEvent(mediaPlayer, "playingChange", {
    isPlaying: mediaPlayer.playing,
  });

  const lastStoredTimeRef = useRef<number>(0);

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

  const handlePlayPause = () => {
    if (isPlaying) {
      mediaPlayer.pause();
    } else {
      mediaPlayer.play();
    }
  };

  const handleTimeUpdate = (event: any) => {
    const time = event.currentTime;
    setCurrentTime(time);

    handleRangeLogic(time);

    const timeSinceLastStore = time - lastStoredTimeRef.current;

    if (lastStoredTimeRef.current > time) {
      lastStoredTimeRef.current = time;
      return;
    }

    const currentSubtitle = getCurrentSubtitle(time);
    if (currentSubtitle) {
      console.log("currentSubtitle", currentSubtitle.text);
    }

    if (timeSinceLastStore < 5) return;

    asStoreData("last-stored-time--media-" + id, time.toString());
    lastStoredTimeRef.current = time;
  };

  useEventListener(mediaPlayer, "timeUpdate", handleTimeUpdate);

  const getCurrentSubtitle = (time: number) => {
    // Optimized subtitle logic with caching
    if (!theMedia?.subtitles) return null;

    const timeInMs = time * 1000;

    // Check if current time is outside the cached subtitle's range
    const needsNewSubtitle =
      !currentSubtitle ||
      timeInMs < currentSubtitle.startTime ||
      timeInMs > currentSubtitle.endTime;

    if (needsNewSubtitle) {
      const newSubtitle = theMedia.subtitles.find(
        (s) => s.startTime <= timeInMs && s.endTime >= timeInMs
      );

      if (newSubtitle !== currentSubtitle) {
        setCurrentSubtitle(newSubtitle || null);
        return newSubtitle;
      }
    }
  };

  if (!mediaSource) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MediaPlayer mediaPlayer={mediaPlayer} />
      <Text>{currentSubtitle?.text}</Text>

      <RangeControls
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        isRangeMode={isRangeMode}
        isPlaying={isPlaying}
        handleRangeButtonPress={handleRangeButtonPress}
        handlePlayRange={handlePlayRange}
        handleResetRange={handleResetRange}
        handlePlayPause={handlePlayPause}
        isRangeButtonDisabled={isRangeButtonDisabled()}
        getRangeButtonText={getRangeButtonText}
        getRangeDisplayText={getRangeDisplayText}
      />

      <Stack.Screen options={{ title: theMedia?.title }} />
    </View>
  );
}
