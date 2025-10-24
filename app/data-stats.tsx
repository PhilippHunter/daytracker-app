import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import { getClosestFriend, getEntryTotalCount, getHighestDayStreak } from "../database/StatsService";
import { StyledText } from "@/components/StyledText";
import { Person } from "@/database/Models";

export default function DataStatsScreen() {
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [highestDayStreak, setHighestDayStreak] = useState<number>(0);
  const [closestFriend, setClosestFriend] = useState<Person>();

  useEffect(() => {
    getEntryTotalCount().then(setTotalEntries);
    getHighestDayStreak().then(setHighestDayStreak);
    getClosestFriend().then((friend) => {
      if (friend) {
        setClosestFriend(friend);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Stat Row */}
      <View style={styles.statRow}>
        <StyledText style={styles.statNumber}>{totalEntries}</StyledText>
        <StyledText style={styles.statLabel}>Total Entries</StyledText>
      </View>
      {/* Separator */}
      <View style={styles.separator} />
      <View style={styles.statRow}>
        <StyledText style={styles.statNumber}>{highestDayStreak}</StyledText>
        <StyledText style={styles.statLabel}>Highest Day Streak</StyledText>
      </View>
      <View style={styles.statRow}>
        <StyledText style={styles.statNumber}>{closestFriend?.name}</StyledText>
        <StyledText style={styles.statLabel}>Closest Friend</StyledText>
      </View>
      {/* Future stats go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#fff",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 16,
    color: "#222",
  },
  statLabel: {
    fontSize: 18,
    color: "#888",
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
});