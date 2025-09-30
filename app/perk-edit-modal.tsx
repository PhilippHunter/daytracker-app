import { StyledText } from "@/components/StyledText";
import { useEffect, useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet } from "react-native";
import { Perk } from "../database/Models";

interface PerkEditModalProps {
  editPerk?: Perk,
  visible: boolean,
  onClose: Function,
  onSave: Function
}

export default function PerkEditModal(props: PerkEditModalProps) {
  const [perk, setPerk] = useState<Omit<Perk, "id">>({ title: "", icon: "", color: "#000000" });

  useEffect(() => {
    if (props.editPerk) {
      setPerk(props.editPerk);
    } else {  
      setPerk({ title: "", icon: "", color: "#000000" });
    }
  }, [props.visible]);

  return (
    <Modal visible={props.visible} animationType="slide" transparent>
      <View style={styles.background}>
        <View style={styles.box}>
          <StyledText style={styles.header}>
            Add Perk
          </StyledText>
          <View style={styles.inputGroup}>
            <StyledText style={styles.inputLabel}>
              Title
            </StyledText>
            <TextInput
              // placeholder="Title"
              value={perk.title}
              onChangeText={title => setPerk({ ...perk, title })}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <StyledText style={styles.inputLabel}>
              Icon
            </StyledText>
            <TextInput
              // placeholder="Icon (Ionicon name)"
              value={perk.icon}
              onChangeText={icon => setPerk({ ...perk, icon })}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <StyledText style={styles.inputLabel}>
              Color
            </StyledText>
            <TextInput
              // placeholder="Color (hex)"
              value={perk.color}
              onChangeText={color => setPerk({ ...perk, color })}
              style={styles.input}
            />
          </View>
          <View style={styles.actions}>
            <Button title="Cancel" onPress={() => props.onClose()} />
            <Button title="Save" onPress={() => props.onSave(perk)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  box: {
    margin: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    // Elevation for Android
    elevation: 12
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputLabel: {
    paddingLeft: 18,
    fontWeight: "bold"
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 50
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12
  }
});