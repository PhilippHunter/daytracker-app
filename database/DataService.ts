import * as SQLite from "expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';
import { Entry, Perk } from "./Models";
import { defaultPerks } from "@/constants/Perks";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./Schema";
import { perks, entries, entryPerks } from './Schema';
import { toDateId } from "@marceloterreiro/flash-calendar";
import { eq } from "drizzle-orm";

// export const db = SQLite.openDatabaseSync("daytracker.db");
const expoDb = SQLite.openDatabaseSync("drizzle-db");
export const db = drizzle(expoDb, {schema});

const today = toDateId(new Date());
const perkRelation: Parameters<typeof db.query.entries.findFirst>[0] = {
  with: {
    entryPerks: {
      columns: {
        entryId: false,
        perkId: false,
      },
      with: {
        perk: true
      }
    }
  }
};

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

// Initialize DB tables
// export function initDB() {
//   db.withTransactionSync(() => {
//     // reset db for dev purposes
//     // resetDB();

//     // Create entries table
//     db.execSync(
//       `CREATE TABLE IF NOT EXISTS entries (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         date TEXT NOT NULL,
//         text TEXT
//       );`
//     );

//     // Create perks table
//     db.execSync(`
//       CREATE TABLE IF NOT EXISTS perks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT,
//         color TEXT,
//         icon TEXT
//       );
//     `);

//     // Create pivot table
//     db.execSync(`
//       CREATE TABLE IF NOT EXISTS entry_perks (
//         entry_id INTEGER,
//         perk_id INTEGER,
//         PRIMARY KEY(entry_id, perk_id),
//         FOREIGN KEY(entry_id) REFERENCES entries(id) ON DELETE CASCADE,
//         FOREIGN KEY(perk_id) REFERENCES perks(id) ON DELETE CASCADE
//       );
//     `);

//     // Insert default perks if table is empty
//     const perkResult = db.getAllSync<{ count: number }>(
//       `SELECT COUNT(*) as count FROM perks;`
//     );
//     if (perkResult[0]?.count === 0) {
//       defaultPerks.forEach((perk) => {
//         db.runSync(
//           `INSERT INTO perks (title, color, icon) VALUES (?, ?, ?);`,
//           perk.title,
//           perk.color,
//           perk.icon
//         );
//       });
//     }

//     // Insert dummy data if table is empty
//     const entryResult = db.getAllSync<{ count: number }>(
//       `SELECT COUNT(*) as count FROM entries;`
//     );
//     if (entryResult[0]?.count === 0) {
//       db.runSync(
//         `INSERT INTO entries (id, date, text) VALUES (?, ?, ?);`,
//         "1",
//         "2025-05-28",
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//       );

//       defaultPerks.forEach((perk, idx) => {
//         db.runSync(
//           `INSERT INTO entry_perks (entry_id, perk_id) VALUES (?, ?);`,
//           "1",
//           idx+1   // besser direkt auf bereits existierende Perks in DB referenzieren (ID)
//         );
//       });
//     }
//   });
// }

// Fetch all entries for calendar view
export async function getAllEntriesForOverview() : Promise<Omit<Entry, "text">[]> {
  try {
    // Get all entries (without text)
    const result = await db.query.entries.findMany({
      ...perkRelation,
      columns: {
        id: true,
        date: true,
        text: false
      }
    });

    return result.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error("Failed to fetch entries for overview: ", error);
    throw error;
  }
}

// Fetch all day entries
export async function getAllEntries(): Promise<Entry[]> {
  try {
    const result = await db.query.entries.findMany(perkRelation);
    return result.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Fetch one specific day entry
export async function getEntry(dateString: string): Promise<Entry | null> {
  try {
    // Fetch the entry by date
    const entry = await db.query.entries.findFirst({
      ...perkRelation,
      where: eq(entries.date, dateString)
    });

    return mapEntry(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with date ${dateString}: `, error);
    throw error;
  }
}

// Fetch one specific day entry by id
async function getEntryById(id: number): Promise<Entry | null> {
  try {
    // Fetch the entry by id
    const entry = await db.query.entries.findFirst({
      ...perkRelation,
      where: eq(entries.id, id)
    });

    return mapEntry(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with id ${id}: `, error);
    throw error;
  }
}

// Add a new entry
// TODO: add perk validation (existence)
// TODO: add field validation (full Entry field must be provided)
export async function createEntry(entry: Entry): Promise<Entry> {
  try {
    let insertedEntryId: number | null = null;
    await db.transaction(async (tx) => {
      // insert whole entry into entries table
      const [insertedEntry] = await tx
        .insert(entries)
        .values({
          date: entry.date,
          text: entry.text
        })
        .returning({ id: entries.id });

      // insert entry.perks into entryPerks relation (entry_perks table)
      if (insertedEntry) {
        await tx.insert(entryPerks).values(
          entry.perks.map(perk => ({
            entryId: insertedEntry.id,
            perkId: perk.id
          }))
        );
        insertedEntryId = insertedEntry.id;
      }
    });
    if (!insertedEntryId) {
      throw new Error("Failed to create entry.");
    }

    // fetch newly created entry outside the transaction
    const created = await getEntryById(insertedEntryId);
    if (!created) {
      throw new Error("Failed to fetch created entry.");
    }
    return created;
  } catch (error) {
    console.error(`Failed to create Entry with date ${entry.date}: `, error)
    throw error;
  }
}

// Update existing entry
export async function updateEntry(entry: Entry): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // update entry
      await tx.update(entries).set({
        date: entry.date,
        text: entry.text,
      }).where(eq(entries.id, entry.id));
    
      // delete related perks
      await tx.delete(entryPerks).where(eq(entryPerks.entryId, entry.id));

      // re-add related perks
      await tx.insert(entryPerks).values(
        entry.perks.map(perk => ({
          entryId: entry.id,
          perkId: perk.id
        }))
      );
    });
  } catch (error) {
    console.error(`Failed to update Entry with date ${entry.date}: `, error)
    throw error;
  }
}

// Delete existing entry
export async function deleteEntry(entry: Entry): Promise<void> {
  try {
    await db.delete(entries).where(eq(entries.id, entry.id));
  } catch (error) {
    console.error(`Failed to update Entry with date ${entry.date}: `, error)
    throw error;
  }
}

// Get available perks
export async function getAllPerks(): Promise<Perk[]> {
  try {
    return await db.query.perks.findMany();
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Get Perk by id helper
async function getPerkById(id: number): Promise<Perk | null> {
  try {
    const result = await db.query.perks
      .findFirst({
        where: eq(perks.id, id)
      });

    if (!result) return null;
    return result;
  } catch (error) {
    console.error(`Failed to fetch perk with id ${id}: `, error);
    throw error;
  }
}

// Update specific Perk
export async function updatePerk(perk: Perk): Promise<void> {
  try {
    await db.update(perks).set({
      title: perk.title,
      color: perk.color,
      icon: perk.icon
    }).where(eq(perks.id, perk.id));
  } catch (error) {
    console.error(`Failed to update Perk with id ${perk.id}: `, error);
    throw error;
  }
}

// Create new Perk
export async function createPerk(perk: Perk): Promise<Perk> {
  try {
    const [result] = await db.insert(perks).values({
      title: perk.title,
      color: perk.color,
      icon: perk.icon
    }).returning();
    
    return result;
  } catch (error) {
    console.error(`Failed to create perk with title ${perk.title}: `, error);
    throw error;
  }
}

// Delete existing Perk
export async function deletePerk(perk: Perk): Promise<void> {
  try {
    await db.delete(perks).where(eq(perks.id, perk.id));
  } catch (error) {
    console.error(`Failed to update Perk with title ${perk.title}: `, error)
    throw error;
  }
}

// Reset DB for dev purposes
export async function resetDB() {
  await db.delete(entryPerks).run();
  await db.delete(entries).run();
  await db.delete(perks).run();
}

function mapEntry(inputEntry: any): Entry {
  if (!inputEntry) return inputEntry;

  return {
    ...inputEntry,
    perks: inputEntry.entryPerks.map((ep: any) => ep.perk)
  } as Entry;
}