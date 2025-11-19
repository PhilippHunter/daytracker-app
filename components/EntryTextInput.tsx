import { FC, useEffect } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Suggestion, SuggestionsProvidedProps, TriggersConfig, useMentions } from 'react-native-controlled-mentions';
import { useState } from 'react';
import * as MentionService from '@/database/Services/MentionService';
import { placeholderSnippets } from "@/constants/TextSnippets";


const triggersConfig: TriggersConfig<'mention'> = {
  mention: {
    // Symbol that will trigger keyword change
    trigger: '@',

    // Style which mention will be highlighted in the `TextInput`
    textStyle: { fontWeight: 'bold', color: 'lightgreen' },
  },
};

export function Suggestions({keyword, onSelect}: SuggestionsProvidedProps) {
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    MentionService.getAllPersons().then((persons => (
      setSuggestions(persons.map(person => ({
        ...person,
        id: person.id.toString()
      })))
    )));
  }, []);

  if (keyword == null || /\s/.test(keyword)) {
    return null;
  }

  return (
    <ScrollView 
      horizontal 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: "rgba(236, 255, 231, 1)"
      }} 
      contentContainerStyle={styles.suggestionContainer}
    >
      {suggestions
        .filter((one) => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
        .map((one) => (
          <Pressable key={one.id} onPress={() => onSelect(one)} 
            style={styles.suggestionChip}>
            <Text style={{fontSize: 15}}>{one.name}</Text>
          </Pressable>
        ))}
    </ScrollView>
  );
};

interface EntryTextInputProps {
  value: string,
  onChange: (value: string) => void
}

export function EntryTextInput({ value, onChange }: EntryTextInputProps) {
  const { textInputProps, triggers } = useMentions({
    value: value,
    onChange: onChange,
    triggersConfig
  });


  return (
    <>
      <Suggestions
        {...triggers.mention}
        // onSelect={() => console.log("mention clicked")}
      />

      <TextInput
        style={styles.textContainer}
        testID="entry-modal_text-input"
        multiline={true}
        placeholder={placeholderSnippets[Math.floor(Math.random() * placeholderSnippets.length)]}
        {...textInputProps}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    padding: 16,
    flex: 1,
    fontFamily: "Roboto",
    lineHeight: 22,
    fontSize: 15,
    textAlignVertical: "top",
  },
  suggestionContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingLeft: 16,
    height: 73,
  },
  suggestionChip: {
    backgroundColor: "rgba(66,255,37,0.19)",
    flexDirection: "row",
    gap: 5,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
    borderColor: "rgba(66,255,37,0.3)",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  }
});