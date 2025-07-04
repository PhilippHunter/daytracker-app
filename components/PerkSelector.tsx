import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Perk } from "@/app/database/Models";
import { getAllPerks } from "@/app/database/DataService";
import PerkComponent from "./Perk";

interface PerkSelectorProps {
  selectedPerks: Perk[];
  onPerkToggle: (Perk: Perk) => void;
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
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {availablePerks.map((perk) => (
        <PerkComponent
          key={perk.id}
          perk={perk}
          initialActivity={selectedPerks.some(selected => selected.id === perk.id)}
          onPerkToggle={() => onPerkToggle(perk)}
        />
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
  }
});
