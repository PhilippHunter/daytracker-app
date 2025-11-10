import { useEffect, useState } from "react";
import { StyledText } from "../components/StyledText";
import { Entry, Person } from "@/database/Models";
import { getAllPersons, getAllPersonsSorted, getMentionsByPerson, getPerson } from "@/database/MentionService";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function FriendsDetail() {
  const [friend, setFriend] = useState<Person>();
  const [mentions, setMentions] = useState<Omit<Entry, "perks"|"mentions">[]>();
  const { selectedPerson } = useLocalSearchParams();
  const friendId = Number(selectedPerson);

  useEffect(() => {
    function getFriendWithData() {
      getPerson(friendId).then(setFriend);
      getMentionsByPerson(friendId).then(setMentions);
    }
    getFriendWithData();
  }, [friendId])

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.details}>
          <View style={styles.logo}>
            <Ionicons name="person" size={64} color="grey" />
          </View>
          <StyledText style={styles.title}>{friend?.name}</StyledText>
          <StyledText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam atque eos molestias ab, provident ad voluptatum laborum at dicta rerum voluptates quae distinctio eveniet recusandae alias temporibus repudiandae vero ratione?</StyledText>
          {/* <View style={styles.separator} /> */}
        </View>
        <View style={styles.list}>
          {mentions?.map(entry => (
            <View style={{flex: 1}}>
              <StyledText style={{fontWeight: "bold"}}>{entry.date}</StyledText>
              <StyledText >{entry.text}</StyledText>
              <View style={styles.separator} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // backgroundColor: "white"
  },
  details: {
    padding: 25,
    alignItems: "center",
    backgroundColor: "white"
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  list: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 25,
    margin: 25
  }
});