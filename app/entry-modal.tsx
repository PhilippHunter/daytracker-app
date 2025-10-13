import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import PerkSelector from "@/components/PerkSelector";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { createEntry, deleteEntry, getEntry, updateEntry } from "@/database/EntryService";
import { Entry, Perk } from "../database/Models";
import { StyledText } from "../components/StyledText";
import { saveEntryWithMentions } from "@/database/EntryPipeline";
import { EntryTextInput } from "@/components/EntryTextInput";

// IDEE:
// mentions lazy nachladen
// eingabe von @ triggert laden von allen personen (oder @p allen mit p)
// so direktes anzeigen der direkten Person möglich (kleines Bildchen und spezifizierte Farbe)

export default function EntryModalScreen() {
  const modalParams = useLocalSearchParams();
  const dayParam = modalParams.selectedDay as string;
  const [entryText, setEntryText] = useState<string>("");
  const [entry, setEntry] = useState<Entry>({
    id: -1,
    date: dayParam,
    text: "",
    perks: [],
    mentions: null
  });

  useEffect(() => {
    getEntry(dayParam).then((fetchedEntry) => {
      if (fetchedEntry) {
        console.log("Eintrag: ", fetchedEntry);
        setEntry(fetchedEntry);
        setEntryText(fetchedEntry.text);
      }
    });
  }, [dayParam]);

  function togglePerk(toggledPerk: Perk) {
    if (entry.perks.some((perk) => perk.id === toggledPerk.id)) {
      // remove perk
      let updatedPerks = entry.perks.filter((perk) => perk.id !== toggledPerk.id);
      setEntry({ ...entry, perks: updatedPerks });
    } else {
      // add perk
      let updatedPerks = [...entry.perks, toggledPerk];
      setEntry({ ...entry, perks: updatedPerks });
    }
  }
  
  async function add() {
    try {
      console.log("adding entry");
      entry.text = entryText;
      const newEntry = await saveEntryWithMentions(entry);
      setEntry(newEntry);
      setEntryText(newEntry.text);
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }
  
  async function update() {
    try {
      console.log("updating entry");
      entry.text = entryText;
      await saveEntryWithMentions(entry);
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }

  async function destroy() {
    try {
      console.log("deleting entry");
      entry.text = entryText;
      await deleteEntry(entry);
      router.dismiss();
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.perkContainer}>
        <PerkSelector
          selectedPerks={entry.perks}
          onPerkToggle={(perk: Perk) => togglePerk(perk)}
        />
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <EntryTextInput value={entryText} onChange={setEntryText} />

      <View style={styles.buttonContainer}>
        {entry.id == -1 ? (
          <TouchableOpacity accessibilityRole="button" onPress={add} style={[styles.button, { flexGrow: 100 }]}>
            <StyledText style={styles.buttonText}>Add</StyledText>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity accessibilityRole="button" onPress={destroy} style={styles.button}>
              <Ionicons name="trash" size={15} color="white"></Ionicons>
            </TouchableOpacity>
            <Pressable accessibilityRole="button" onPress={update} style={({pressed}) => [styles.button, { flexGrow: 100, opacity: pressed ? 0.3 : 1 }]}>
              <StyledText style={[styles.buttonText]}>Update</StyledText>
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
    // alignContent: "space-between",
    paddingBottom: 20,
  },
  perkContainer: {
    flexGrow: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    flexGrow: 0,
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
    letterSpacing: 2,
    textTransform: "uppercase"
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
