import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayTimeData } from "../types";

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

// Play Time Storage Functions
export const getPlayTimeKey = (videoId: string) => `play-time--${videoId}`;

export const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD format in user's timezone
};

export const storePlayTime = async (
  videoId: string,
  additionalSeconds: number
) => {
  try {
    const today = getTodayDate();
    const existingData = await getPlayTime(videoId);

    let playTimeData: PlayTimeData;

    if (existingData) {
      // Update existing data
      const todayIndex = existingData.dailyPlayTimes.findIndex(
        (d) => d.date === today
      );

      if (todayIndex >= 0) {
        // Update today's play time
        existingData.dailyPlayTimes[todayIndex].seconds += additionalSeconds;
      } else {
        // Add new day
        existingData.dailyPlayTimes.push({
          date: today,
          seconds: additionalSeconds,
        });
      }

      existingData.totalSeconds += additionalSeconds;
      existingData.lastUpdated = new Date().toISOString();
      playTimeData = existingData;
    } else {
      // Create new data
      playTimeData = {
        videoId,
        totalSeconds: additionalSeconds,
        dailyPlayTimes: [{ date: today, seconds: additionalSeconds }],
        lastUpdated: new Date().toISOString(),
      };
    }

    await AsyncStorage.setItem(
      getPlayTimeKey(videoId),
      JSON.stringify(playTimeData)
    );
  } catch (error) {
    console.error("Error storing play time:", error);
  }
};

export const getPlayTime = async (
  videoId: string
): Promise<PlayTimeData | null> => {
  try {
    const data = await AsyncStorage.getItem(getPlayTimeKey(videoId));
    if (data) {
      return JSON.parse(data) as PlayTimeData;
    }
    return null;
  } catch (error) {
    console.error("Error getting play time:", error);
    return null;
  }
};

export const getTodayPlayTime = async (videoId: string): Promise<number> => {
  try {
    const playTimeData = await getPlayTime(videoId);
    if (!playTimeData) return 0;

    const today = getTodayDate();
    const todayData = playTimeData.dailyPlayTimes.find((d) => d.date === today);
    return todayData ? todayData.seconds : 0;
  } catch (error) {
    console.error("Error getting today's play time:", error);
    return 0;
  }
};

export const getAllPlayTimes = async (): Promise<
  Record<string, PlayTimeData>
> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const playTimeKeys = keys.filter((key) => key.startsWith("play-time--"));

    if (playTimeKeys.length === 0) return {};

    const playTimeData = await AsyncStorage.multiGet(playTimeKeys);
    const result: Record<string, PlayTimeData> = {};

    playTimeData.forEach(([key, value]) => {
      if (value) {
        const videoId = key.replace("play-time--", "");
        result[videoId] = JSON.parse(value) as PlayTimeData;
      }
    });

    return result;
  } catch (error) {
    console.error("Error getting all play times:", error);
    return {};
  }
};
