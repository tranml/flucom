import { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, Pressable } from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type CameraProps = {
  onClose: () => void;
};

export const Camera = ({ onClose }: CameraProps) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <ActivityIndicator size="large" color="white" />;
  }
  return (
    <View>
      <CameraView style={styles.camera} facing="front">
        <View style={styles.footer}>
        <Pressable style={styles.recordButton}>
            <View style={styles.recordButtonInner}></View>
        </Pressable>
        </View>
      </CameraView>
      <MaterialIcons
        name="close"
        size={24}
        color="white"
        style={styles.closeButton}
        onPress={onClose}
      />
    </View>
  );
};

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
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    zIndex: 1000,
  },
  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    paddingBottom: 40,
    marginTop: "auto",
    alignItems: "center",
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
});
