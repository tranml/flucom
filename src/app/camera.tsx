import { useEffect, useState, useRef } from "react";
import { StyleSheet, ActivityIndicator, View, Pressable } from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import RecordedVideo from "../components/RecordedVideo";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | undefined>(undefined);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <ActivityIndicator size="large" color="white" />;
  }

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef.current?.stopRecording();
      // console.log("stopRecording: ", videoUri);
      return;
    }

    setIsRecording(true);
    const result = await cameraRef.current?.recordAsync({
      maxDuration: 10,
    });
    // console.log("startRecording: ", result?.uri);
    setVideoUri(result?.uri);
    setIsRecording(false);
  };

  const closeRecordedVideoView = () => {
    setVideoUri(undefined);
  };

  if (videoUri) {
    return (
      <View style={{ flex: 1 }}>
        <RecordedVideo videoUri={videoUri} onClose={closeRecordedVideoView} />
      </View>
    );
  }

  return (
    <View>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        mode="video"
      />
      <View style={[styles.footer, isRecording && styles.footerActive]}>
        <Pressable style={[styles.recordButton]} onPress={toggleRecording}>
          <View
            style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive,
            ]}
          ></View>
        </Pressable>
      </View>
      {/* <MaterialIcons
        name="close"
        size={24}
        color="white"
        style={styles.closeButton}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  // closeButton: {
  //   position: "absolute",
  //   top: 20,
  //   left: 20,
  //   borderRadius: 25,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   padding: 5,
  //   zIndex: 1000,
  // },
  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    paddingBottom: 40,
    marginTop: "auto",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent`",
    borderWidth: 7,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
  },
  recordButtonInnerActive: {
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  footerActive: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});
