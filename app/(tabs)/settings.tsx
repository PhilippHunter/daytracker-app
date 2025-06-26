import { Pressable, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { StyledText } from "@/components/StyledText";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="calendar" size={64} color="#222" />
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.list}>
        <Pressable
          style={styles.button}
          // onPress={() => router.push("/data-settings")}
        >
          <View style={styles.buttonLeft}>
            <Ionicons name="calendar-outline" size={20} />
            <StyledText style={styles.buttonText}>Data Settings</StyledText>
          </View>
          <Ionicons name="chevron-forward" size={20}/>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/perk-settings")}
        >
          <View style={styles.buttonLeft}>
            <Ionicons name="brush" size={20}/>
            <StyledText style={styles.buttonText}>Perk Customization</StyledText>
          </View>
          <Ionicons name="chevron-forward" size={20}/>
        </Pressable>
        <Pressable 
          style={styles.button} 
          onPress={() => router.push("/data-stats")}
        >
          <View style={styles.buttonLeft}>
            <Ionicons name="stats-chart" size={20} />
            <StyledText style={styles.buttonText}>Data Stats</StyledText>
          </View>
          <Ionicons name="chevron-forward" size={20}/>
        </Pressable>
      </View>

      {/* <EditScreenInfo path="app/(tabs)/settings.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "linear-gradient(180deg, #222 60%, #555 100%)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  list: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 25,
    // marginVertical: 8,
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25
  },
  buttonText: { 
    fontSize: 20,
    // fontWeight: "bold" 
  },
  separator: {
    marginTop: 30,
    height: 1,
    width: "80%",
  },
});
