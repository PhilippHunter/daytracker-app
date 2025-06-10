import { StyleSheet } from "react-native";

import { CalendarList, Agenda } from "react-native-calendars";
import { Text, View } from "@/components/Themed";
import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { getAllEntries, getAllEntriesForOverview } from "@/app/database/DataService";
import { Entry } from "@/app/database/Entry";
import { defaultPerks } from "@/constants/Perks";

export default function ScrollCalendar() {
  const [entries, setEntries] = useState<Array<Omit<Entry, "text">>>([]);

  // Calendar props
  const today = toDateId(new Date());
  const markedDates = Object.fromEntries(
    entries.map((entry) => {
      let dots: any[] = [];
      if (entry.perks.length !== 0) {
        dots = entry.perks
          .map((perkKey: any) => defaultPerks.find((defaultPerk) => defaultPerk.key === perkKey))
          .filter(Boolean);
      }
      return [entry.date, { dots: dots }];
    })
  );

  // Load Entries from DB
  useFocusEffect(
    useCallback(() => {
      const fetchEntries = async function () {
        try {
          const allEntries = await getAllEntriesForOverview();
          setEntries(allEntries);
          console.log("Fetched entries: ", allEntries);
        } catch (error) {
          // show error msg
        }
      };
      
      fetchEntries();
    }, [])
  );

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
  );
}
