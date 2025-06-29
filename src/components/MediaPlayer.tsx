import { View, Text } from "react-native";
import { VideoPlayer, VideoView } from "expo-video";

type MediaPlayerProps = {
  mediaPlayer: VideoPlayer;
};

export default function MediaPlayer({ mediaPlayer }: MediaPlayerProps) {
  return (
    <View>
      <VideoView
        player={mediaPlayer}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
      />
    </View>
  );
}
