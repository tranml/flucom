import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import MediaPlayer from "../components/MediaPlayer";
import { useEventListener } from "expo";
import { media} from "../lib/media-data";

const mediaSource = media[1].url;

export default function MediaPlayerScreen() {
  const mediaPlayer = useVideoPlayer(mediaSource, (player) => {
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
