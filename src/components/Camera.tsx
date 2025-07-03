import { useEffect } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useCameraPermissions } from "expo-camera";
export const Camera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if(permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <ActivityIndicator size="large" color="white" />;
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
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
});
