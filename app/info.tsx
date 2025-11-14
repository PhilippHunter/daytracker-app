import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { StyledText } from "@/components/StyledText";

export default function InfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>How to Use the Calendar</Text>
      <Text style={styles.paragraph}>
        The calendar is the heart of DayTracker. Here’s how you can use it to track your days and habits:
      </Text>

      <View style={styles.section}>
        <Ionicons name="calendar-outline" size={32} color="#222" style={styles.icon} />
        <StyledText style={styles.sectionTitle}>Select a Day</StyledText>
        <StyledText style={styles.paragraph}>
          Tap any day on the calendar to view or create an entry for that date.
          A small dot below a date means you’ve tracked perks for that day.
        </StyledText>
      </View>

      <View style={styles.section}>
        <Ionicons name="star-outline" size={32} color="#f7b731" style={styles.icon} />
        <StyledText style={styles.sectionTitle}>Add Perks</StyledText>
        <StyledText style={styles.paragraph}>
          Perks are customizable tags you can assign to each day. Tap to select one or more perks that describe your day (e.g., Sport, Reading, Nutrition).
        </StyledText>

      <View style={styles.tipBox}>
        <Ionicons name="information-circle-outline" size={20} color="#3867d6" />
        <StyledText style={styles.tipText}>
          Tip: Customize your perks in the settings tab to match your personal habits and goals!
        </StyledText>
      </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="create-outline" size={32} color="#3867d6" style={styles.icon} />
        <StyledText style={styles.sectionTitle}>Write Notes</StyledText>
        <StyledText style={styles.paragraph}>
          Add a short text entry to record thoughts, achievements, or anything important about your day.
        </StyledText>
      </View>

      <View style={styles.section}>
        <Ionicons name="people-outline" size={28} color="#6a66ff" style={[styles.icon, { marginTop: 10 }]} />
        <StyledText style={styles.sectionTitle}>Friends</StyledText>
        <StyledText style={styles.paragraph}>
          Add people by mentioning them in an entry. Mentioned people are collected into the Friends list, accessible through the Tab Menu.
        </StyledText>

        <StyledText style={styles.paragraph}>
          Tap a friend to open their profile and see all entries that mention them.
        </StyledText>

        <View style={styles.tipBox}>
          <Ionicons name="information-circle-outline" size={18} color="#3867d6" />
          <StyledText style={styles.tipText}>
            Tip: Create a friend by typing @ followed by their name when writing an entry — the app extracts mentions automatically.
          </StyledText>
        </View>
      </View>

      <View style={styles.section}>
        <Ionicons name="checkmark-done-outline" size={32} color="#20bf6b" style={styles.icon} />
        <StyledText style={styles.sectionTitle}>Save & Review</StyledText>
        <StyledText style={styles.paragraph}>
          Your entries are saved automatically. You can revisit any day to see your perks and notes, helping you reflect on your progress over time.
        </StyledText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    // alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
    color: "#222",
    textAlign: "center",
  },
  icon: {
    marginBottom: 4,
    textAlign: "center"
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf0fb",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  tipText: {
    marginLeft: 8,
    color: "#3867d6",
    fontSize: 15,
    flex: 1,
  },
});