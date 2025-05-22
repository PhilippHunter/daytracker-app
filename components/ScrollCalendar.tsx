import { StyleSheet } from "react-native";

import { CalendarList, Agenda } from "react-native-calendars";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { router } from "expo-router";
import { toDateId } from "@marceloterreiro/flash-calendar";

export default function ScrollCalendar() {
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

  return (
    <CalendarList
      markingType={"multi-dot"}
      markedDates={{ ...markedDates }}
      maxDate={today}
      scrollEnabled={true}
      futureScrollRange={0}
      onDayPress={(day) =>
        router.push({ pathname: "/modal", params: { day: day.dateString } })
      }
    />
  );
}
