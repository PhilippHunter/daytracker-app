import { StyleSheet } from "react-native";

import { CalendarList, Agenda } from "react-native-calendars";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { getAllEntries } from "@/app/database/DataService";
import { Entry } from "@/app/database/Entry";

export default function ScrollCalendar() {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Perks
  const vacation = { key: "vacation", color: "orange" };
  const massage = { key: "massage", color: "red" };
  const workout = { key: "workout", color: "blue" };

  // Calendar props
  const markedDates = {
    "2025-05-17": { dots: [vacation, massage, workout] },
    "2025-05-18": { dots: [massage, workout] },
  };
  const today = toDateId(new Date());

  // Load Entries from DB
  useEffect(() => {
    const fetchEntries = async function() {
      try {
        const entries = await getAllEntries();
        setEntries(entries);
      } catch (error) {
        // show error msg
      }
    }

    fetchEntries();
  }, [])

  return (
    <CalendarList
      markingType={"multi-dot"}
      markedDates={{ ...markedDates }}
      maxDate={today}
      scrollEnabled={true}
      futureScrollRange={0}
      onDayPress={(day) =>
        router.push({ pathname: "/modal", params: { selectedDay: day.dateString } })
      }
    />
    // <>
    //   {entries.map((entry) => (
    //     <View key={entry.id}>
    //       <Text>{entry.date}</Text>
    //       <Text>{entry.text}</Text>
    //     </View>
    //   ))}
    // </>
  );
}
