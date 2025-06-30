import {
  View,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { VideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

type MediaPlayerProps = {
  mediaPlayer: VideoPlayer;
  isPlaying: boolean;
};

export default function MediaPlayer({
  mediaPlayer,
  isPlaying,
}: MediaPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      {isLoading && (
        <ImageBackground
          source={require("../../assets/video-placeholder.png")}
          style={[styles.imageBackground, StyleSheet.absoluteFill]}
        >
          <ActivityIndicator size="large" color="black" />
        </ImageBackground>
      )}
      <View style={styles.videoContainer}>
        <VideoView
          player={mediaPlayer}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          onFirstFrameRender={() => setIsLoading(false)}
        />
        <Ionicons
          onPress={() => {
            if (isPlaying) {
              mediaPlayer.pause();
            } else {
              mediaPlayer.play();
            }
          }}
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={72}
          color="black"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  imageBackground: {
    justifyContent: "center",
    opacity: 0.6,
  },
  videoContainer: {
    gap: 10,
    alignItems: "center",
  },
});
