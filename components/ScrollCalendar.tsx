import { StyleSheet } from "react-native";

import { CalendarList, Agenda } from "react-native-calendars";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { getAllEntries } from "@/app/database/DataService";
import { Entry } from "@/app/database/Entry";
import { defaultPerks } from "@/constants/Perks";

export default function ScrollCalendar() {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Calendar props
  // const markedDates = Object.fromEntries(
  //   entries.map((entry) => {
  //     let dots: any[] = [];
  //     const perksArray = Array.isArray(entry.perks) ? entry.perks : [];
  //     if (perksArray.length !== 0) {
  //       dots = perksArray
  //         .map((perkKey) => defaultPerks.find((defaultPerk) => defaultPerk.key === perkKey))
  //         .filter(Boolean);
  //     }
  //     return [entry.date, { dots: dots }];
  //   })
  // );
  // console.log(markedDates);
  const markedDates = {
    "2025-05-28": { dots: [defaultPerks[1], defaultPerks[2]] },
  };
  const today = toDateId(new Date());

  // Load Entries from DB
  useEffect(() => {
    const fetchEntries = async function () {
      try {
        const allEntries = await getAllEntries();
        setEntries(allEntries);
        console.log(allEntries);
      } catch (error) {
        // show error msg
      }
    };

    fetchEntries();
  }, []);

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
