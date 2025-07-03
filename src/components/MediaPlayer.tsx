import {
  View,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { VideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

type MediaPlayerProps = {
  mediaPlayer: VideoPlayer;
};

export default function MediaPlayer({ mediaPlayer }: MediaPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View>
      {isLoading && (
        <ImageBackground
          source={require("../../assets/video-placeholder.png")}
          style={[styles.imageBackground, StyleSheet.absoluteFill]}
        >
          <ActivityIndicator size="large" color="black" />
        </ImageBackground>
      )}
      <VideoView
        player={mediaPlayer}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        onFirstFrameRender={() => setIsLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  imageBackground: {
    justifyContent: "center",
    opacity: 0.6,
  },
});
