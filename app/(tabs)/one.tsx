import { StyledText } from "@/components/StyledText";
import { defaultPerks } from "@/constants/Perks";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as schema from '@/database/Schema';
import { getAllEntries } from "@/database/EntryService";
import { Entry, Perk } from "@/database/Models";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';


export default function TabOneScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, {schema});
  useDrizzleStudio(expoDb);

  useEffect(() => {
    const load = async function () {
      const entries = await getAllEntries();
      setEntries(entries);
    };
    load();
  }, [])

  return (
    <View>
      <View>
          {entries.map((entry: Entry) => (
            <View key={entry.id}>
              <StyledText>{entry.date}</StyledText>
              <StyledText>{entry.text}</StyledText>
              {/* {entry.entryPerks.map((perk: Perk) => (
                <StyledText key={perk.id}>{perk.title}</StyledText>
              ))} */}
            </View>
          ))}
      </View>
    </View>
  );
}

