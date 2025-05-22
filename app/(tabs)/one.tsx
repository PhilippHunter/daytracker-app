import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { Text, View } from "react-native";

const today = toDateId(new Date());

export default function TabOneScreen() {
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <View style={{ flex: 1 }}>
      <Text>Selected date: {selectedDate}</Text>
      <Calendar.List
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMaxDateId={today}
        calendarInitialMonthId={today}
        onCalendarDayPress={setSelectedDate}
      />
    </View>
  );
}

