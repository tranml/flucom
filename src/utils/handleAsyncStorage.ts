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

// Helper function to read all historical tracking data
export const getAllSessions = async (): Promise<
  Array<{
    videoId: string;
    startTime: number;
    endTime: number;
    duration: number;
    timestamp: number;
  }>
> => {
  try {
    // Get all keys from AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();

    // Filter keys that match our video-sessions pattern
    const sessionKeys = allKeys.filter((key) =>
      key.startsWith("video-sessions-")
    );

    // Sort keys by date (newest first)
    sessionKeys.sort().reverse();

    // Fetch all session data
    const allSessions: Array<{
      videoId: string;
      startTime: number;
      endTime: number;
      duration: number;
      timestamp: number;
    }> = [];

    for (const key of sessionKeys) {
      const sessionsData = await asGetData(key);
      if (sessionsData) {
        try {
          const sessions = JSON.parse(sessionsData);
          if (Array.isArray(sessions)) {
            allSessions.push(...sessions);
          }
        } catch (parseError) {
          console.error(`Failed to parse sessions from ${key}:`, parseError);
        }
      }
    }

    // Sort all sessions by timestamp (newest first)
    allSessions.sort((a, b) => b.timestamp - a.timestamp);

    console.log(
      `Retrieved ${allSessions.length} total sessions from ${sessionKeys.length} ${sessionKeys.length === 1 ? "day" : "days"}`
    );
    return allSessions;
  } catch (error) {
    console.error("Failed to retrieve sessions:", error);
    return [];
  }
};

// Helper function to delete all tracking sessions
export const deleteAllSessions = async (): Promise<void> => {
  try {
    // Get all keys from AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();
    
    // Filter keys that match our video-sessions pattern
    const sessionKeys = allKeys.filter(key => key.startsWith('video-sessions-'));
    
    if (sessionKeys.length === 0) {
      console.log('No tracking sessions found to delete');
      return;
    }
    
    // Delete all session keys
    await AsyncStorage.multiRemove(sessionKeys);
    
    console.log(`Deleted ${sessionKeys.length} tracking session keys:`, sessionKeys);
  } catch (error) {
    console.error('Failed to delete tracking sessions:', error);
  }
};