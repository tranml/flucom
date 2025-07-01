import { Text, TouchableOpacity, View } from "react-native";
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

  // Phase 1: Range management
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

  // Phase 2: Button logic and state transitions
  const handleRangeButtonPress = () => {
    if (!isSettingPointB) {
      // Setting point A
      setRangeStart(currentTime);
      setIsSettingPointB(true);
    } else {
      // Setting point B
      if (isCurrentTimeValidForPointB()) {
        setRangeEnd(currentTime);
        setIsRangeMode(true);
        setIsSettingPointB(false);
      }
    }
  };

  const handleResetRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setIsRangeMode(false);
    setIsSettingPointB(false);
  };

  const getRangeButtonText = (): string => {
    if (isRangeMode) return "Range Active";
    if (isSettingPointB) return "Set Point B";
    return "Set Point A";
  };

  const isRangeButtonDisabled = (): boolean => {
    if (isRangeMode) return true;
    if (isSettingPointB) return !isCurrentTimeValidForPointB();
    return false;
  };

  const getRangeDisplayText = (): string => {
    if (!isRangeMode || !rangeStart || !rangeEnd) return "";
    return `Range: ${formatTime(rangeStart)} - ${formatTime(rangeEnd)}`;
  };

  // Phase 3: Simple video playback control
  const handleTimeUpdate = (event: any) => {
    const time = event.currentTime;
    setCurrentTime(time);

    // Phase 3: Exit range mode if time goes out of bounds
    if (isRangeMode && rangeStart !== null && rangeEnd !== null) {
      if (time < rangeStart || time > rangeEnd) {
        // Silent exit from range mode
        setRangeStart(null);
        setRangeEnd(null);
        setIsRangeMode(false);
        setIsSettingPointB(false);
      }
    }

    const timeSinceLastStore = time - lastStoredTimeRef.current;

    if (timeSinceLastStore < 5) return;

    asStoreData("last-stored-time--media-" + id, time.toString());
    lastStoredTimeRef.current = time;
  };

  useEventListener(mediaPlayer, "timeUpdate", handleTimeUpdate);

  // useEventListener(mediaPlayer, "timeUpdate", (event) => {
  //   const time = event.currentTime;

  //   // Phrase 2: Button logic and state transitions > Update current time
  //   setCurrentTime(time);

  //   const timeSinceLastStore = time - lastStoredTimeRef.current;

  //   if (timeSinceLastStore < 5) return;

  //   asStoreData("last-stored-time--media-" + id, time.toString());
  //   lastStoredTimeRef.current = time;
  // });

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
    <View style={{ flex: 1 }}>
      <MediaPlayer mediaPlayer={mediaPlayer} />

      {/* Phase 2: Range controls buttons */}
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          {getRangeDisplayText()}
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: isRangeButtonDisabled() ? '#ccc' : '#007AFF',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={handleRangeButtonPress}
          disabled={isRangeButtonDisabled()}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {getRangeButtonText()}
          </Text>
        </TouchableOpacity>

        {isRangeMode && (
          <TouchableOpacity
            style={{
              backgroundColor: '#FF3B30',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center'
            }}
            onPress={handleResetRange}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Reset Range
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Stack.Screen options={{ title: theMedia?.title }} />
    </View>
  );
}
