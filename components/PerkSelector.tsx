import Colors from "@/constants/Colors";
import { defaultPerks } from "@/constants/Perks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { StyledText } from "./StyledText";

interface PerkSelectorProps {
  selectedPerks: string[], 
  onPerkToggle: (perkKey: string) => void
}

export default function PerkSelector({selectedPerks, onPerkToggle}: PerkSelectorProps) {
  // TODO: future goal to add more perks from user input
  const availablePerks = defaultPerks;

  function isPerkSelected(key: string) {
    return selectedPerks.find((perk) => perk == key);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {availablePerks.map((perk) => (
        <Pressable
          key={perk.key}
          onPress={() => onPerkToggle(perk.key)}
          style={[
            styles.chip,
            {
              borderColor: perk.color,
              backgroundColor: isPerkSelected(perk.key) ? perk.color : "",
            },
          ]}
        >
          <Ionicons
            name={perk.icon as React.ComponentProps<typeof Ionicons>["name"]}
          />
          <StyledText>{perk.title}</StyledText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 16,
    paddingLeft: 16,
  },
  chip: {
    flexDirection: "row",
    gap: 5,
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
