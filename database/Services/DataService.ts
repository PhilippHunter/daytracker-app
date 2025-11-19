import * as SQLite from "expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';
import { defaultPerks } from "@/constants/Perks";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "../Schema";
import { perks, entries, entryPerks } from '../Schema';

// export const db = SQLite.openDatabaseSync("daytracker.db");
const expoDb = SQLite.openDatabaseSync("drizzle-db");
export const db = drizzle(expoDb, {schema});

const today = new Date().toISOString().substring(0,10);

export async function initDrizzleDb() {
  const isInitialized = AsyncStorage.getItemSync("db-initialized");
  if (isInitialized) return;

  console.log("initializing drizzle db...");

  // Insert perks
  const insertedPerks = await db
    .insert(perks)
    .values(defaultPerks)
    .returning();  

    // Insert entry
  const insertedEntry = await db
      .insert(entries)
      .values({
        date: today,
        text: `Sample entry text here.`,
      })
      .returning({ id: entries.id });
  
    // Insert pivot
    if (insertedEntry.length > 0) {
      const entryId = insertedEntry[0].id;
      await db.insert(entryPerks).values([
        { entryId, perkId: insertedPerks[0].id },
        { entryId, perkId: insertedPerks[1].id }
      ]);
    }

  AsyncStorage.setItemSync("db-initialized", "true");
}

// Reset DB for dev purposes
export async function resetDB() {
  await db.delete(entryPerks).run();
  await db.delete(entries).run();
  await db.delete(perks).run();
}