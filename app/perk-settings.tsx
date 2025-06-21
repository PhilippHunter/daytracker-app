import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "@/components/Themed";
import { Perk } from "./database/Models";
import { getAllPerks } from "./database/DataService";
import { StyledText } from "@/components/StyledText";

export default function PerkSettingsScreen() {
  const [perks, setPerks] = useState<Perk[]>([]);

  useEffect(() => {
    fetchPerks();
  }, []);

  async function fetchPerks() {
    const data = await getAllPerks();
    setPerks(data);
  }

  function handleDelete(perk: Perk) {
    Alert.alert(
      "Delete Perk",
      `This deletes all references in the calendar entries. Are you sure you want to delete "${perk.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            // TODO: Delete logic
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={perks}
        keyExtractor={perk => perk.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: `${item.color}` }]} />
            <Ionicons name={item.icon} size={20} style={styles.icon} />
            <StyledText style={styles.title}>{item.title}</StyledText>
            <View style={styles.actions}>
              <Pressable onPress={() => { console.log("Edit button pressed on item: ", item.title) }}>
                <Ionicons name="pencil" size={22} color="#888" />
              </Pressable>
              <Pressable onPress={() => handleDelete(item)}>
                <Ionicons name="trash" size={22} color="#e74c3c" />
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Pressable style={styles.fab} onPress={() => { console.log("Add button pressed") }}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    justifyContent: "space-between",
  },
  dot: {
    borderRadius: 50,
    width: 15,
    height: 15,
    marginRight: 16,
    borderColor: "black",
    borderWidth: 1,
  },
  icon: { marginRight: 16 },
  title: { flex: 1, fontSize: 18 },
  actions: { flexDirection: "row", gap: 18 },
  separator: { height: 1, backgroundColor: "#eee", marginHorizontal: 16 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#222",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});