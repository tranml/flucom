import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Media } from "../types";

import {
  getCourseTitleFromMedia,
  getLessonSetTitle,
  getMediaType,
} from "../lib/media-data";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

export default function MediaCard({ media }: { media: Media }) {
  const mediaType = getMediaType(media);

  const [localMediaPath, setLocalMediaPath] = useState<string>("");

  useEffect(() => {
    isDownloaded(media).then((isDownloaded) => {
      if (isDownloaded) {
        setLocalMediaPath(getLocalMediaPath(media));
      }
    });
  }, [media]);

  const downloadMedia = async () => {
    console.log("downloading media");

    const downloadResumable = FileSystem.createDownloadResumable(
      media.url,
      FileSystem.documentDirectory + media.id + ".mp4",
      {}
    );

    try {
      const result = await downloadResumable.downloadAsync();
      console.log("Finish downloading to", result?.uri);
      setLocalMediaPath(result?.uri || "");
    } catch (error) {
      console.error("error downloading media", error);
    }
  };

  const getLocalMediaPath = (media: Media) => {
    return FileSystem.documentDirectory + media.id + ".mp4";
  };

  const isDownloaded = async (media: Media) => {
    const path = getLocalMediaPath(media);
    const fileInfo = await FileSystem.getInfoAsync(path);
    return fileInfo.exists && fileInfo.size > 0;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.lessonTitle}>{media.title}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Ionicons name="albums" size={24} color="black" />
        <Text style={styles.lessonSetTitle}>
          {getLessonSetTitle(media.lessonSetId)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <MaterialIcons name="collections-bookmark" size={24} color="black" />
        <Text style={styles.courseTitle}>{getCourseTitleFromMedia(media)}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{mediaType}</Text>
        </View>
        {!localMediaPath ? (
          <MaterialIcons
            name="cloud-download"
            size={32}
            color="black"
            onPress={downloadMedia}
          />
        ) : (
          <Ionicons
            name="trash-bin-sharp"
            size={24}
            color="#dd0000"
            onPress={downloadMedia}
          />
        )}

        {mediaType === "video" && localMediaPath && (
          <Link href="/media-player" asChild>
            <MaterialIcons name="play-circle" size={32} color="green" />
          </Link>
        )}
        {mediaType === "audio" && localMediaPath && (
          <Link href="/media-player" asChild>
            <MaterialIcons name="volume-up" size={32} color="green" />
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    padding: 16,
    marginBottom: 16,
    minWidth: 300,
    gap: 16,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  lessonSetTitle: {
    fontSize: 10,
    color: "#888",
  },
  courseTitle: {
    fontSize: 10,
    color: "#888",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
});
