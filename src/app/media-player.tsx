import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import MediaPlayer from "../components/MediaPlayer";
import { useEventListener } from "expo";

const videoSource =
  "https://res.cloudinary.com/dqssqzt3y/video/upload/v1750664615/unit-4--part-4-of-4_aowxmp.mp4";

export default function MediaPlayerScreen() {
  const mediaPlayer = useVideoPlayer(videoSource, (player) => {
    player.showNowPlayingNotification = true;
    player.timeUpdateEventInterval = 0.5;
    // player.play();
  });

  useEventListener(mediaPlayer, "timeUpdate", (event) => {
    console.log("Current time: ", event.currentTime);
  });

  return (
    <View>
      <MediaPlayer mediaPlayer={mediaPlayer} />
      <Stack.Screen options={{ title: "Media Player" }} />
    </View>
  );
}
