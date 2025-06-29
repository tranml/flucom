
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Media } from "../types";

import {
  getCourseTitleFromMedia,
  getLessonSetTitle,
  getMediaType,
} from "../lib/media-data";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function MediaCard({ media }: { media: Media }) {
  const mediaType = getMediaType(media);
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

        {mediaType === "video" && (
          <MaterialIcons name="play-circle" size={24} color="black" />
        )}
        {mediaType === "audio" && (
          <MaterialIcons name="volume-up" size={24} color="black" />
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
