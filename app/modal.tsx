import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import PerkSelector from '@/components/PerkSelector';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { getEntry } from './database/DataService';

export default function ModalScreen() {
  const modalParams = useLocalSearchParams();

  const [text, setText] = useState("Moin");
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  
  const dayParam = modalParams.selectedDay;

  useEffect(() => {
    if (typeof dayParam === 'string') {
      getEntry(dayParam).then((entry) => {
        if (entry) {
          console.log("Eintrag: ", entry);
          setText(entry.text);
          setSelectedPerks(entry.perks);
        }
      });
    }
  }, [dayParam]);

  function togglePerk(key: string) {
    function isPerkSelected(key: string) {
      return selectedPerks.find((perk) => perk == key);
    }

    if (isPerkSelected(key)) {
      let updatedPerks = selectedPerks.filter((perk) => perk !== key);
      setSelectedPerks(updatedPerks);
    } else {
      let updatedPerks = [...selectedPerks, key];
      setSelectedPerks(updatedPerks);
    }
  }

  function deleteEntry() {
    console.log('deleting entry');
  }
  
  function addEntry() {
    console.log('adding entry');
  }
  
  return (
    <View style={styles.container}>

      <View style={styles.perkContainer}>
        <PerkSelector selectedPerks={selectedPerks} onPerkToggle={(key: string) => togglePerk(key)} />
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <TextInput
        style={styles.textContainer}
        multiline={true}
        onChangeText={(text) => setText(text)}
        value={text}
      />

      <View style={styles.buttonContainer}>
        <Pressable onPress={deleteEntry} style={styles.button}>
          <Ionicons name="trash" size={20} color="white"></Ionicons>
        </Pressable>
        <Pressable onPress={addEntry} style={[styles.button, { flexGrow: 100 }]}>
          <Text style={styles.buttonText}>Add Entry</Text>
        </Pressable>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16
  },
  button: {
    gap: 5,
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white"
  },
  separator: {
    margin: "auto",
    height: 1,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});
