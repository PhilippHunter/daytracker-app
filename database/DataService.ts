import * as SQLite from "expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';
import { Entry, Perk } from "./Schema";
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
export async function getAllEntriesForOverview() {
  try {
    // Get all entries (without text)
    const result = await db.query.entries.findMany({
      columns: {
        id: true,
        date: true,
        text: false
      }, 
      with: {
        entryPerks: {
          columns: {
            perkId: false,
            entryId: false
          },
          with: {
            perk: true
          }
        }
      }
    });

    return mapEntryPerks(result);
  } catch (error) {
    console.error("Failed to fetch entries for overview: ", error);
    throw error;
  }
}

// Fetch all day entries
export async function getAllEntries() {
  try {
    const result = await db.query.entries.findMany({
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
    });

    return mapEntryPerks(result);
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Fetch one specific day entry
export async function getEntry(dateString: string): Promise<Entry | null> {
  try {
    // Fetch the entry by date
    const entry = db.query.entries.findFirst({
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
      },
      where: eq(entries.date, dateString)
    });

    return mapEntryPerks(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with date ${dateString}: `, error);
    throw error;
  }
}

// TODO: keep it DRY
async function getEntryById(id: number): Promise<Entry | null> {
  try {
    // Fetch the entry by id
    const entry = db.query.entries.findFirst({
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
      },
      where: eq(entries.id, id)
    });

    return mapEntryPerks(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with id ${id}: `, error);
    throw error;
  }
}

// Add a new entry
// TODO: add perk validation (existence)
// TODO: add field validation (full Entry field must be provided)
// export async function createEntry(entry: Entry): Promise<Entry> {
//   try {
//     let created: Entry | null = null;   // bridge to return Entry out from the transaction
//     await db.withTransactionAsync(async () => {
//       // create statement for entry
//       const entryResult = await db.runAsync(
//         `INSERT INTO entries (date, text) VALUES (?, ?);`,
//         entry.date,
//         entry.text,
//       );
      
//       // create statement for perk relation
//       for (const perk of entry.perks) {
//         await db.runAsync(
//           `INSERT INTO entry_perks (entry_id, perk_id) VALUES (?, ?);`,
//           entryResult.lastInsertRowId,
//           perk.id
//         );
//       }
      
//       // fetch newly created entry
//       created = await getEntryById(entryResult.lastInsertRowId);
//     });
//     if (!created) {
//       throw new Error("Failed to create entry.");
//     }
//     return created;
//   } catch (error) {
//     console.error(`Failed to create Entry with date ${entry.date}: `, error)
//     throw error;
//   }
// }

// Update existing entry
// export async function updateEntry(entry: Entry): Promise<void> {
//   try {
//     await db.withTransactionAsync(async () => {
//       await db.runAsync(
//         `UPDATE entries 
//         SET date = ?, 
//         text = ?
//         WHERE id = ?;`,
//         entry.date,
//         entry.text,
//         entry.id
//       );
      
//       // Remove all existing perks for this entry
//       await db.runAsync(
//         `DELETE FROM entry_perks WHERE entry_id = ?;`,
//         entry.id
//       );
      
//       // Insert the new set of perks
//       for (const perk of entry.perks) {
//         await db.runAsync(
//           `INSERT INTO entry_perks (entry_id, perk_id) VALUES (?, ?);`,
//           entry.id,
//           perk.id
//         );
//       }
//     });
//   } catch (error) {
//     console.error(`Failed to update Entry with date ${entry.date}: `, error)
//     throw error;
//   }
// }

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
// async function getPerkById(id: number): Promise<Perk | null> {
//   try {
//     return await db.getFirstAsync<Perk>(`SELECT * FROM perks WHERE id = ?;`, id);
//   } catch (error) {
//     console.error(`Failed to fetch perk with id ${id}: `, error);
//     throw error;
//   }
// }

// Update specific Perk
// export async function updatePerk(perk: Perk): Promise<void> {
//   try {
//     await db.runAsync(
//       `UPDATE perks 
//       SET title = ?, 
//       color = ?,
//       icon = ?
//       WHERE id = ?;`,
//       perk.title,
//       perk.color,
//       perk.icon,
//       perk.id
//     );
//   } catch (error) {
//     console.error(`Failed to update Perk with id ${perk.id}: `, error);
//     throw error;
//   }
// }

// Create new Perk
// export async function createPerk(perk: Perk): Promise<Perk> {
//   try {
//     const result = await db.runAsync(
//       `INSERT INTO perks (title, color, icon) VALUES (?, ?, ?);`,
//       perk.title, 
//       perk.color,
//       perk.icon
//     );

//     const created = await getPerkById(result.lastInsertRowId);
//     if (!created) {
//       throw new Error(`Failed to fetch created perk with id ${result.lastInsertRowId}`);
//     }
//     return created;
//   } catch (error) {
//     console.error(`Failed to create perk with title ${perk.title}: `, error);
//     throw error;
//   }
// }

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

function mapEntryPerks(inputEntries: any) {
  return inputEntries.map((entry: any) => ({
      ...entry,
      perks: entry.entryPerks.map((ep: any) => ep.perk)
    }));
}