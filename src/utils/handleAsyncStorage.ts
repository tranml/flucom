import AsyncStorage from "@react-native-async-storage/async-storage";

export const asStoreData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error storing current time:", error);
  }
};

export const asGetData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting current time:", error);
  }
};

