import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

export default function PerkSelector() {
  const availablePerks = [
    { key: "vacation", title: "Vacation", color: "orange", icon: "airplane" },
    { key: "nutrition", title: "Nutrition", color: "red", icon: "nutrition" },
    { key: "reading", title: "Reading", color: "blue", icon: "book" },
    { key: "household", title: "Household", color: "green", icon: "home" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >      
    {availablePerks.map((perk) => (
        <Pressable key={perk.key} style={[
          styles.chip,
          {
            borderColor: perk.color,
          }
        ]}>
          <Ionicons
            name={perk.icon as React.ComponentProps<typeof Ionicons>["name"]}
          />
          <Text>{perk.title}</Text>
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
  }
});
