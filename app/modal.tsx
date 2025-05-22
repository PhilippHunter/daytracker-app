import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import PerkSelector from '@/components/PerkSelector';

export default function ModalScreen() {
  const { selectedDay } = useLocalSearchParams<{ selectedDay: string }>();
  const [text, setText] = useState("Moin")
  
  return (
    <View style={styles.container}>

      <View style={styles.perkContainer}>
        <PerkSelector />
      </View>

      <TextInput
        style={styles.textContainer}
        multiline={true}
        onChangeText={(text) => setText(text)}
        value={text}/>

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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
