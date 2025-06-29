import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import MediaPlayer from "../components/MediaPlayer";

const videoSource =
  "https://res.cloudinary.com/dqssqzt3y/video/upload/v1750664615/unit-4--part-4-of-4_aowxmp.mp4";

export default function MediaPlayerScreen() {
  const mediaPlayer = useVideoPlayer(videoSource, (player) => {
    player.showNowPlayingNotification = true,
    player.play();
  });


  return (
    <View>
      <MediaPlayer mediaPlayer={mediaPlayer} />
      <Stack.Screen options={{ title: "Media Player" }} />
    </View>
  );
}
