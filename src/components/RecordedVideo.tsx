import { View, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

type RecordedVideoProps = {
  videoUri: string;
};

export default function RecordedVideo({ videoUri }: RecordedVideoProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });
  return <View>
    <VideoView player={player} style={{ width: "100%", height: "100%" }} />
  </View>;
}