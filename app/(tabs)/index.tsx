import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import ScrollCalendar from "@/components/ScrollCalendar";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ScrollCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
