import { StyledText } from "@/components/StyledText";
import { defaultPerks } from "@/constants/Perks";
import { entries, Entry, Perk, entryPerks, perks } from "@/database/Schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as schema from '@/database/Schema';
import { getAllEntries } from "@/database/DataService";


export default function TabOneScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, {schema});

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
              {entry.entryPerks.map((perk: Perk) => (
                <StyledText key={perk.id}>{perk.title}</StyledText>
              ))}
            </View>
          ))}
      </View>
    </View>
  );
}

