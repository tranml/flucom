import { View, Text, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import * as MediaLibrary from "expo-media-library";
import { useState } from "react";

type RecordedVideoProps = {
  videoUri: string;
  onClose: () => void;
};

export default function RecordedVideo({
  videoUri,
  onClose,
}: RecordedVideoProps) {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [isSaved, setIsSaved] = useState(false);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const onSaveVideo = async (uri: string) => {
    if (permissionResponse?.status !== "granted") {
      requestPermission();
    }
    await MediaLibrary.createAssetAsync(uri);
    setIsSaved(true);
  };

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
      <MaterialIcons
        name={isSaved ? "check" : "save"}
        size={24}
        color="white"
        style={[
          styles.saveButton,
          { backgroundColor: isSaved ? "green" : "rgba(0, 0, 0, 0.5)" },
        ]}
        onPress={() => {
          if (isSaved) return;

          if (videoUri) {
            onSaveVideo(videoUri);
          }
        }}
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
  saveButton: {
    position: "absolute",
    top: 40,
    right: 4,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    zIndex: 1000,
  },
});
