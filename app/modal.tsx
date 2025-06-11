import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import PerkSelector from "@/components/PerkSelector";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { createEntry, deleteEntry, getEntry, updateEntry } from "./database/DataService";
import { Entry } from "./database/Entry";
import { StyledText } from "../components/StyledText";

export default function ModalScreen() {
  const modalParams = useLocalSearchParams();
  const dayParam = modalParams.selectedDay as string;
  const [entry, setEntry] = useState<Entry>({
    id: -1,
    date: dayParam,
    text: "Moin",
    perks: [],
  });

  useEffect(() => {
    getEntry(dayParam).then((fetchedEntry) => {
      if (fetchedEntry) {
        console.log("Eintrag: ", fetchedEntry);
        setEntry(fetchedEntry);
      }
    });
  }, [dayParam]);

  function togglePerk(key: string) {
    function isPerkSelected(key: string) {
      return entry.perks.find((perk) => perk == key);
    }

    if (isPerkSelected(key)) {
      // remove perk
      let updatedPerks = entry.perks.filter((perk) => perk !== key);
      setEntry({ ...entry, perks: updatedPerks });
    } else {
      // add perk
      let updatedPerks = [...entry.perks, key];
      setEntry({ ...entry, perks: updatedPerks });
    }
  }
  
  async function add() {
    try {
      console.log("adding entry");
      const newEntry = await createEntry(entry);
      setEntry(newEntry);
    } catch (error) {
      // Show error msg
      console.log('failed...');
    }
  }
  
  async function update() {
    try {
      console.log("updating entry");
      await updateEntry(entry);
    } catch (error) {
      // Show error msg
      console.log('failed...');
    }
  }

  async function destroy() {
    try {
      console.log("deleting entry");
      await deleteEntry(entry);
      router.dismiss();
    } catch (error) {
      // Show error msg
      console.log('failed...');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.perkContainer}>
        <PerkSelector
          selectedPerks={entry.perks}
          onPerkToggle={(key: string) => togglePerk(key)}
        />
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <TextInput
        style={styles.textContainer}
        multiline={true}
        onChangeText={(text) => setEntry({ ...entry, text: text })}
        value={entry.text}
      />

      <View style={styles.buttonContainer}>
        {entry.id == -1 ? (
          <Pressable onPress={add} style={[styles.button, { flexGrow: 100 }]}>
            <StyledText style={styles.buttonText}>Add</StyledText>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={destroy} style={styles.button}>
              <Ionicons name="trash" size={15} color="white"></Ionicons>
            </Pressable>
            <Pressable onPress={update} style={[styles.button, { flexGrow: 100 }]}>
              <StyledText style={styles.buttonText}>Update</StyledText>
            </Pressable>
          </>
        )}
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  perkContainer: {
    flexGrow: 0,
  },
  textContainer: {
    padding: 16,
    marginBottom: 40,
    flexGrow: 2,
    fontFamily: "Roboto",
    lineHeight: 22,
    fontSize: 15
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
  },
  button: {
    gap: 5,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    fontFamily: "Roboto",

  },
  separator: {
    margin: "auto",
    height: 1,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});
