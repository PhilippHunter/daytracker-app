import { Perk } from "@/database/Models";
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

  function blendWithBlack(hex: string, percent = 0.65): string {
    // Remove # if present
    hex = hex.replace(/^#/, "");
    // Parse r, g, b
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Blend with black
    r = Math.round(r * (1 - percent));
    g = Math.round(g * (1 - percent));
    b = Math.round(b * (1 - percent));

    // Return as hex
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return (
    <Pressable
      key={props.perk.id}
      accessibilityRole="checkbox"
      accessibilityState={{ selected: isSelected}}
      onPress={() => handlePress()}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: props.perk.color,
          backgroundColor: pressed
            ? `${props.perk.color}20`
            : isSelected
            ? `${props.perk.color}60`
            : "transparent",
        },
      ]}
    >
      <Ionicons
        name={props.perk.icon as React.ComponentProps<typeof Ionicons>["name"]}
        size={15}
        color={blendWithBlack(props.perk.color)}
      />
      <StyledText style={[styles.text, { color: blendWithBlack(props.perk.color) }]}>
        {props.perk.title.toUpperCase()}
      </StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    gap: 5,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
    // color: "#222",
    textTransform: "uppercase"
  }
});
