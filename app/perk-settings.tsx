import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "@/components/Themed";
import { Perk } from "./database/Models";
import { createPerk, deletePerk, getAllPerks, updateEntry, updatePerk } from "./database/DataService";
import PerkEditModal from "./perk-edit-modal";
import PerkComponent from "@/components/Perk";
import { useFocusEffect } from "expo-router";

export default function PerkSettingsScreen() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editPerk, setEditPerk] = useState<Perk>();

  useFocusEffect(
    useCallback(() => {
      fetchPerks();
    }, [])
  );

  async function fetchPerks() {
    const data = await getAllPerks();
    setPerks(data);
  }

  function handleAdd() {
    setEditPerk(undefined);
    setModalVisible(true);
  }

  async function handleSave(perk: Perk) {
    console.log("Saving perk: ", perk);
    try {
      if (!perk.id) {
        await createPerk(perk);
      } else {
        await updatePerk(perk);
      }
      fetchPerks();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEdit(perk: Perk) {
    console.log("Edit button pressed on item: ", perk.title);
    setEditPerk(perk);
    setModalVisible(true);
  }

  async function handleDelete(perk: Perk) {
    Alert.alert(
      "Delete Perk",
      `This deletes all references in the calendar entries. Are you sure you want to delete "${perk.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            try {
              await deletePerk(perk);
              fetchPerks();
              console.log("Deleted sucessfully!");
            } catch (error) {
              console.error(error);
            }
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
            <PerkComponent perk={item} initialActivity={true} onPerkToggle={() => { return null; }} />
            <View style={styles.actions}>
              <Pressable onPress={() => handleEdit(item)}>
                <Ionicons name="brush" size={22} color="#222" />
              </Pressable>
              <Pressable onPress={() => handleDelete(item)}>
                <Ionicons name="trash" size={22} color="#222" />
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Pressable style={styles.fab} onPress={() => handleAdd() }>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
      
      <PerkEditModal
        editPerk={editPerk}
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSave={(perk: Perk) => handleSave(perk)}
      ></PerkEditModal>
    </View>

  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    justifyContent: "space-between",
  },
  dot: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginRight: 16,
    borderColor: "black",
    borderWidth: 1,
  },
  icon: { 
    marginRight: 16,
    color: "#222",
  },
  title: { 
    flex: 1, 
    fontSize: 20 
  },
  actions: { 
    flexDirection: "row", 
    gap: 18 
  },
  separator: { 
    height: 1, 
    backgroundColor: "#eee", 
    marginHorizontal: 16 
  },
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