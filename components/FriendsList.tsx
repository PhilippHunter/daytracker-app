import { useEffect, useState } from "react";
import { StyledText } from "./StyledText";
import { Person } from "@/database/Models";
import { getAllPersons, getAllPersonsSorted } from "@/database/MentionService";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FriendsList() {
  const [friends, setFriends] = useState<Person[]>([]);

  useEffect(() => {
    async function getFriends() {
      const result = await getAllPersonsSorted();
      const mappedResult = result.map((person) => {
        return {
          ...person,
          dayDiff: Math.floor(
            Math.abs(new Date().getTime() - new Date(person.lastMention).getTime()) 
            / (1000 * 60 * 60 * 24)
          )
        }
      }
      
      );
      setFriends(mappedResult);
    }
    getFriends();
  }, [])

  return (
    <>
      <ScrollView contentContainerStyle={styles.list}>
        {friends.map((friend) => (
          <Pressable
            key={friend.id}
            style={styles.button}
            onPress={() => router.push({ pathname: "/friends-detail", params: { selectedPerson: friend.id }})}
          >
            <View style={styles.buttonLeft}>
              <View style={styles.img}>
                <Ionicons name="person" size={40} color="#222" />
              </View>              
              <View style={styles.buttonText}>
                <StyledText style={{fontSize: 20}}>{friend.name}</StyledText>
                <StyledText style={{color: "grey"}}>zuletzt erwähnt vor {friend.dayDiff} Tagen</StyledText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20}/>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  list: {
    width: "100%",
    alignItems: "center",
    height: "100%",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 25,
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25
  },
  buttonText: { 
    display: "flex",
    flexDirection: "column"
  },
  img: {
    // width: 120,
    // height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});