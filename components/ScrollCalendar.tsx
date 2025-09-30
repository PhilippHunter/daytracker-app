import { CalendarList } from "react-native-calendars";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { getAllEntriesForOverview } from "@/database/DataService";
import { Entry } from "@/database/Models";

export default function ScrollCalendar() {
  const [entries, setEntries] = useState<Array<Omit<Entry, "text">>>([]);

  // Calendar props
  const today = toDateId(new Date());
  const markedDates = Object.fromEntries(
    entries.map((entry) => {
      return [entry.date, { dots: entry.perks }];
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
          console.error(error);
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
      firstDay={1}
      onDayPress={(day) =>
        router.push({ pathname: "/entry-modal", params: { selectedDay: day.dateString } })
      }
      theme={{
        todayTextColor: "black",
      }}
    />
  );
}
