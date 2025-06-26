import { Perk } from "@/app/database/Models";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { useEffect, useState } from "react";

interface PerkProps {
  perk: Perk;
  initialActivity: boolean;
  onPerkToggle: Function;
}

export default function PerkComponent(props: PerkProps) {
  const [isSelected, setSelected] = useState<boolean>(false);
  // set initial pressed value
  useEffect(() => {
    setSelected(props.initialActivity);
  }, [props.initialActivity]);

  function handlePress() {
    setSelected(!isSelected);
    props.onPerkToggle(props.perk);
  }

  return (
    <Pressable
      key={props.perk.id}
      onPress={() => handlePress()}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: props.perk.color,
          backgroundColor: pressed
            ? `${props.perk.color}20`
            : isSelected
            ? `${props.perk.color}60`
            : "",
        },
      ]}
    >
      <Ionicons
        name={props.perk.icon as React.ComponentProps<typeof Ionicons>["name"]}
      />
      <StyledText>{props.perk.title}</StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
