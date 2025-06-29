import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Media } from "../types";

export default function AudioCard({ media }: { media: Media }) {
  return (
    <View style={styles.card}>
      <Text style={styles.lessonTitle}>{media.title}</Text>
      <Text style={styles.lessonSetTitle}>{media.lessonSetId}</Text>

      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>audio</Text>
        </View>

        <MaterialIcons name="volume-up" size={24} color="#666" />
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
    gap: 4
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  lessonSetTitle: {
    fontSize: 12,
    color: "#888",
  },
  courseTitle: {
    fontSize: 12,
    color: "#999",
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
