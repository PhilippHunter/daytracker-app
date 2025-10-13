import { FC, useEffect } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Suggestion, SuggestionsProvidedProps, TriggersConfig, useMentions } from 'react-native-controlled-mentions';
import { useState } from 'react';
import { getAllPersons } from '@/database/MentionService';
import { placeholderSnippets } from "@/constants/TextSnippets";


const triggersConfig: TriggersConfig<'mention'> = {
  mention: {
    // Symbol that will trigger keyword change
    trigger: '@',

    // Style which mention will be highlighted in the `TextInput`
    textStyle: { fontWeight: 'bold', color: 'lightgreen' },
  },
};

interface SuggestionsProps extends SuggestionsProvidedProps {
  inputLayout: {
    x: number,
    y: number,
    height: number,
    width: number
  }
}

export function Suggestions({keyword, onSelect, inputLayout}: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getAllPersons().then((persons => (
      setSuggestions(persons.map(person => ({
        ...person,
        id: person.id.toString()
      })))
    )));
  }, []);

  if (keyword == null) {
    return null;
  }

  return (
    <ScrollView 
      horizontal 
      style={(styles.suggestionContainer, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white'
      })} 
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
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { textInputProps, triggers } = useMentions({
    value: value,
    onChange: onChange,
    triggersConfig
  });

  function handleInputLayout(event: LayoutChangeEvent) {
    setInputLayout(event.nativeEvent.layout);
  }

  return (
    <>
      <Suggestions
        inputLayout={inputLayout}
        {...triggers.mention}
        // onSelect={() => console.log("mention clicked")}
        /> 

      <TextInput
        style={styles.textContainer}
        testID="entry-modal_text-input"
        multiline={true}
        placeholder={placeholderSnippets[Math.floor(Math.random() * placeholderSnippets.length)]}
        onLayout={handleInputLayout}
        {...textInputProps}
        />
    </>
  );
}

const styles = StyleSheet.create({
    textContainer: {
    padding: 16,
    marginBottom: 40,
    flexGrow: 2,
    fontFamily: "Roboto",
    lineHeight: 22,
    fontSize: 15,
    textAlignVertical: "top",
  },
  suggestionContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    padding: 12
  },
  suggestionWrapper: {
    paddingRight: 16,
  },
  suggestionChip: {
    padding: 12, 
    backgroundColor: 'lightgreen',
    borderRadius: 50,
    marginRight: 12,
  }
});