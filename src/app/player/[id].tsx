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

import {
  asGetData,
  asStoreData,
  storePlayTime,
  getPlayTime,
} from "../../utils/handleAsyncStorage";

import { useRangePlayer } from "../../hooks/useRangePlayer";
import { RangeControls } from "../../components/RangeControls";
import { PlayTimeData, SubtitleEntry } from "../../types";
import { formatPlayTimeSummary } from "../../utils/formatTime";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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

  const [triggerFromSubtitlePress, setTriggerFromSubtitlePress] =
    useState<boolean>(false);

  // Play time tracking state
  const [playTimeData, setPlayTimeData] = useState<PlayTimeData | null>(null);
  const [todayPlayTime, setTodayPlayTime] = useState<number>(0);
  const playStartTimeRef = useRef<number | null>(null);
  const accumulatedPlayTimeRef = useRef<number>(0);
  const lastSaveTimeRef = useRef<number>(0);

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

  // Play time tracking
  // implementation
  //--------------------------------
  // Load existing play time data when component mounts
  useEffect(() => {
    const loadPlayTimeData = async () => {
      if (!id) return;

      const existingData = await getPlayTime(id);
      if (existingData) {
        setPlayTimeData(existingData);
        accumulatedPlayTimeRef.current = existingData.totalSeconds;
      }
    };

    loadPlayTimeData();
  }, [id]);

  // Play time tracking effect
  useEffect(() => {
    if (!id) return;

    if (isPlaying) {
      // Video started playing - record start time
      playStartTimeRef.current = Date.now();
    } else {
      // Video stopped playing - accumulate play time
      if (playStartTimeRef.current !== null) {
        const playDuration = Math.floor(
          (Date.now() - playStartTimeRef.current) / 1000
        );
        accumulatedPlayTimeRef.current += playDuration;
        playStartTimeRef.current = null;

        // Save play time immediately when video stops
        storePlayTime(id, playDuration);
      }
    }
  }, [isPlaying, id]);

  // Save play time periodically (every 30 seconds)
  useEffect(() => {
    if (!id || !isPlaying) return;

    const saveInterval = setInterval(() => {
      if (playStartTimeRef.current !== null) {
        const currentPlayDuration = Math.floor(
          (Date.now() - playStartTimeRef.current) / 1000
        );
        const totalPlayDuration =
          accumulatedPlayTimeRef.current + currentPlayDuration;

        // Only save if we have accumulated at least 30 seconds since last save
        if (totalPlayDuration - lastSaveTimeRef.current >= 30) {
          const newPlayTime = totalPlayDuration - lastSaveTimeRef.current;
          storePlayTime(id, newPlayTime);
          lastSaveTimeRef.current = totalPlayDuration;
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(saveInterval);
  }, [id, isPlaying]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (id && playStartTimeRef.current !== null) {
        // Save any remaining play time when component unmounts
        const finalPlayDuration = Math.floor(
          (Date.now() - playStartTimeRef.current) / 1000
        );
        storePlayTime(id, finalPlayDuration);
      }
    };
  }, [id]);

  // end of play time tracking
  // implementation

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

    // if (lastStoredTimeRef.current > time) {
    //   lastStoredTimeRef.current = time;
    //   return;
    // }

    getCurrentSubtitle(time);

    // const currentSubtitle = getCurrentSubtitle(time);
    // if (currentSubtitle) {
    //   console.log("currentSubtitle", currentSubtitle.text);
    // }

    if (lastStoredTimeRef.current > time) {
      lastStoredTimeRef.current = time;
      return;
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

        {/* Play Time Display */}
        {playTimeData && playTimeData.totalSeconds > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              padding: 16,
              backgroundColor: "#f8f8f8",
              marginHorizontal: 16,
              borderRadius: 8,
            }}
          >
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={{ fontSize: 14, color: "#666" }}>
              {formatPlayTimeSummary(playTimeData.totalSeconds, todayPlayTime)}
            </Text>
          </View>
        )}
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
          {isRangeMode && triggerFromSubtitlePress
            ? frozenSubtitle?.text
            : currentSubtitle?.text}
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
