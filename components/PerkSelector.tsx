import Colors from "@/constants/Colors";
import { defaultPerks } from "@/constants/Perks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { StyledText } from "./StyledText";
import { Perk } from "@/app/database/Models";
import { getAllPerks } from "@/app/database/DataService";

interface PerkSelectorProps {
  selectedPerks: Perk[], 
  onPerkToggle: (Perk: Perk) => void
}

export default function PerkSelector({selectedPerks, onPerkToggle}: PerkSelectorProps) {
  const [availablePerks, setAvailablePerks] = useState<Perk[]>([]);

  useEffect(() => {
    const fetchPerks = async function () {
      try {
        const allPerks = await getAllPerks();
        setAvailablePerks(allPerks);
        console.log("Fetched perks: ", allPerks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerks();
  }, [])

  function isPerkSelected(id: number) {
    return selectedPerks.find((perk) => perk.id == id);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {availablePerks.map((perk) => (
        <Pressable
          key={perk.id}
          onPress={() => onPerkToggle(perk)}
          style={({pressed}) => [
            styles.chip,
            {
              borderColor: perk.color,
              backgroundColor: pressed ? `${perk.color}80` : (
                isPerkSelected(perk.id) ? perk.color : ""
              )
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
