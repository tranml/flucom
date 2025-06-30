import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import MediaPlayer from "../components/MediaPlayer";
import { useEvent, useEventListener } from "expo";
import { media } from "../lib/media-data";

const mediaSource = media[1].url;

export default function MediaPlayerScreen() {
  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
    // player.play();
  });

  const { isPlaying } = useEvent(mediaPlayer, "playingChange", {
    isPlaying: mediaPlayer.playing,
  });

  useEventListener(mediaPlayer, "timeUpdate", (event) => {
    console.log("Current time: ", event.currentTime);
  });

  console.log("isPlaying", isPlaying);

  return (
    <View>
      <MediaPlayer mediaPlayer={mediaPlayer} isPlaying={isPlaying} />
      <Stack.Screen options={{ title: "Media Player" }} />
    </View>
  );
}
