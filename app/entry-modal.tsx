import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import PerkSelector from "@/components/PerkSelector";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import * as EntryService from "@/database/Services/EntryService";
import { Entry, EntryWithRelations, Perk } from "../database/Models";
import { StyledText } from "../components/StyledText";
import * as EntryPipeline from "@/database/Utilities/EntryPipeline";
import { EntryTextInput } from "@/components/EntryTextInput";
import { useFullScreenModalHeaderHeight } from "@/components/useFullScreenModalHeaderHeight";
import { replaceTriggerValues } from "react-native-controlled-mentions";
import { SafeAreaView } from "react-native-safe-area-context";

// IDEE:
// mentions lazy nachladen
// eingabe von @ triggert laden von allen personen (oder @p allen mit p)
// so direktes anzeigen der direkten Person möglich (kleines Bildchen und spezifizierte Farbe)

export default function EntryModalScreen() {
  const modalParams = useLocalSearchParams();
  const dayParam = modalParams.selectedDay as string;
  const [entryText, setEntryText] = useState<string>("");
  const [entry, setEntry] = useState<EntryWithRelations>({
    id: -1,
    date: dayParam,
    text: "",
    perks: [],
    mentions: null
  });
  const headerHeight = useFullScreenModalHeaderHeight();

  useEffect(() => {
    EntryService.getEntry(dayParam).then((fetchedEntry) => {
      if (fetchedEntry) {
        console.log("Eintrag: ", fetchedEntry);
        setEntry(fetchedEntry);
        setEntryText(fetchedEntry.text ?? "");
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
      entry.text = replaceTriggerValues(entryText, ({ name }) => `@${name}`);
      const newEntry = await EntryPipeline.saveEntryWithMentions(entry);
      setEntry(newEntry);
      setEntryText(newEntry.text ?? "");
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }
  
  async function update() {
    try {
      console.log("updating entry");
      entry.text = replaceTriggerValues(entryText, ({ name }) => `@${name}`);
      await EntryPipeline.saveEntryWithMentions(entry);
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }

  async function destroy() {
    try {
      console.log("deleting entry");
      entry.text = entryText;
      await EntryService.deleteEntry(entry);
      router.dismiss();
    } catch (error) {
      // Show error msg
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior="padding" 
      keyboardVerticalOffset={headerHeight}
    >
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

      <SafeAreaView style={styles.buttonContainer}>
        {entry.id == -1 ? (
          <TouchableOpacity accessibilityRole="button" onPress={add} style={[styles.button, { flexGrow: 100 }]}>
            <Ionicons name="add-outline" size={20} color="white"></Ionicons>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity accessibilityRole="button" onPress={destroy} style={styles.button}>
              <Ionicons name="trash" size={15} color="white"></Ionicons>
            </TouchableOpacity>
            <Pressable accessibilityRole="button" onPress={update} style={({pressed}) => [styles.button, { flexGrow: 100, opacity: pressed ? 0.3 : 1 }]}>
              <Ionicons name="checkmark" size={15} color="white"></Ionicons>
            </Pressable>
          </>
        )}
      </SafeAreaView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  perkContainer: {
    flexShrink: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexShrink: 0,
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 20
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
