import { View, Text, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type RecordedVideoProps = {
  videoUri: string;
  onClose: () => void;
};

export default function RecordedVideo({
  videoUri,
  onClose,
}: RecordedVideoProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <VideoView
        player={player}
        style={{ width: "100%", aspectRatio: 9 / 16 }}
      />
      <MaterialIcons
        name="close"
        size={24}
        color="white"
        style={styles.closeButton}
        onPress={onClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 40,
    left: 4,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    zIndex: 1000,
  },
});
