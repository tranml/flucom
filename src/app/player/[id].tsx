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

import { formatTime } from "../../utils/formatTime";
import { useRangePlayer } from "../../hooks/useRangePlayer";
import { RangeControls } from "../../components/RangeControls";

export default function MediaPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theMedia = media.find((m) => m.id === id);

  const [mediaSource, setMediaSource] = useState<string>("");

  // const [rangeStart, setRangeStart] = useState<number | null>(null);
  // const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  // const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  // const [isSettingPointB, setIsSettingPointB] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  
  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
  });

  const {
    rangeStart,
    rangeEnd,
    isRangeMode,
    // isSettingPointB,
    handleRangeButtonPress,
    handlePlayRange,
    handleResetRange,
    getRangeButtonText,
    isRangeButtonDisabled,
    getRangeDisplayText,
  } = useRangePlayer({
    mediaPlayer,
    currentTime,
    setCurrentTime,
    id,
  });


  const { isPlaying } = useEvent(mediaPlayer, "playingChange", {
    isPlaying: mediaPlayer.playing,
  });

  // const lastStoredTimeRef = useRef<number>(0);

  // const isCurrentTimeValidForPointB = (): boolean => {
  //   if (!rangeStart) return false;
  //   return currentTime > rangeStart + 1;
  // };

  // const handleRangeButtonPress = () => {
  //   if (!isSettingPointB) {
  //     setRangeStart(currentTime);
  //     setIsSettingPointB(true);
  //   } else {
  //     if (isCurrentTimeValidForPointB()) {
  //       setRangeEnd(currentTime);
  //       setIsSettingPointB(false);
  //     }
  //   }
  // };

  // const handlePlayRange = () => {
  //   if (rangeStart !== null && rangeEnd !== null) {
  //     setIsRangeMode(true);
  //     mediaPlayer.currentTime = rangeStart;
  //     mediaPlayer.play();
  //   }
  // };

  // const handleResetRange = () => {
  //   setRangeStart(null);
  //   setRangeEnd(null);
  //   setIsRangeMode(false);
  //   setIsSettingPointB(false);
  // };

  // const getRangeButtonText = (): string => {
  //   if (isRangeMode) return "Range Active";
  //   if (isSettingPointB) return "Set Point B";
  //   if (rangeStart && rangeEnd) return "Play Range";
  //   return "Set Point A";
  // };

  // const isRangeButtonDisabled = (): boolean => {
  //   if (isRangeMode) return true;
  //   if (isSettingPointB) return !isCurrentTimeValidForPointB();
  //   return false;
  // };

  // const getRangeDisplayText = (): string => {
  //   if (!rangeStart || !rangeEnd) return "";
  //   return `Range: ${formatTime(rangeStart)} - ${formatTime(rangeEnd)}`;
  // };

  // const handleTimeUpdate = (event: any) => {
  //   const time = event.currentTime;
  //   setCurrentTime(time);

  //   if (isRangeMode && rangeStart !== null && rangeEnd !== null) {
  //     if (time >= rangeEnd) {
  //       mediaPlayer.currentTime = rangeStart;
  //       mediaPlayer.play();
  //     }

  //     if (time < rangeStart - 2) {
  //       handleResetRange();
  //     }
  //   }

  //   const timeSinceLastStore = time - lastStoredTimeRef.current;

  //   if (timeSinceLastStore < 5) return;

  //   asStoreData("last-stored-time--media-" + id, time.toString());
  //   lastStoredTimeRef.current = time;
  // };

  // useEventListener(mediaPlayer, "timeUpdate", handleTimeUpdate);

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

    // Handle play/pause for range mode
  const handlePlayPause = () => {
    if (isPlaying) {
      mediaPlayer.pause();
    } else {
      mediaPlayer.play();
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

      {/* <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
          {getRangeDisplayText()}
        </Text>

        {isRangeMode ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              flex: 1,
            }}
            onPress={() => {
              if (isPlaying) {
                mediaPlayer.pause();
              } else {
                mediaPlayer.play();
              }
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: isRangeButtonDisabled() ? "#ccc" : "#007AFF",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={
              rangeStart && rangeEnd ? handlePlayRange : handleRangeButtonPress
            }
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {getRangeButtonText()}
            </Text>
          </TouchableOpacity>
        )}
        {rangeStart && rangeEnd && (
          <TouchableOpacity
            style={{
              backgroundColor: "#FF3B30",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => {
              handleResetRange();
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Reset Range
            </Text>
          </TouchableOpacity>
        )}
      </View> */}

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
