import { Text, TouchableOpacity, View } from "react-native";
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

  // Add state for frozen subtitle when in range mode
  const [frozenSubtitle, setFrozenSubtitle] = useState<SubtitleEntry | null>(
    null
  );

  const [triggerFromSubtitlePress, setTriggerFromSubtitlePress] = useState<boolean>(false);

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
    // TODO: Play in range based on subtitle
    setRangeFromSubtitle,
    handleResetPointA,
    isSettingPointB,
    handleJumpToRangeStart,
  } = useRangePlayer({
    mediaPlayer,
    currentTime,
  });

  // Effect to handle frozen subtitle when entering/exiting range mode
  useEffect(() => {
    if (isRangeMode && !frozenSubtitle && triggerFromSubtitlePress) {
      // When entering range mode, freeze the current subtitle
      setFrozenSubtitle(currentSubtitle);
    } else if (!isRangeMode && frozenSubtitle) {
      // When exiting range mode, clear the frozen subtitle
      setFrozenSubtitle(null);
      setTriggerFromSubtitlePress(false);
    }
  }, [isRangeMode, currentSubtitle, frozenSubtitle, triggerFromSubtitlePress]);

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

    getCurrentSubtitle(time);

    // const currentSubtitle = getCurrentSubtitle(time);
    // if (currentSubtitle) {
    //   console.log("currentSubtitle", currentSubtitle.text);
    // }

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

  const handleSubtitlePress = () => {
    if (currentSubtitle && !isRangeMode) {
      mediaPlayer.pause();
      setRangeFromSubtitle(currentSubtitle.startTime, currentSubtitle.endTime);
      setTriggerFromSubtitlePress(true);
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
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View>
        <MediaPlayer mediaPlayer={mediaPlayer} />
      </View>

      <TouchableOpacity
        style={{
          padding: 16,
          alignSelf: "center",
        }}
        onPress={handleSubtitlePress}
        disabled={isRangeMode}
      >
        <Text>
          {isRangeMode && triggerFromSubtitlePress ? frozenSubtitle?.text : currentSubtitle?.text}
        </Text>
      </TouchableOpacity>

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
        isSettingPointB={isSettingPointB}
        handleResetPointA={handleResetPointA}
        handleJumpToRangeStart={handleJumpToRangeStart}
      />

      <Stack.Screen options={{ title: theMedia?.title }} />
    </View>
  );
}
