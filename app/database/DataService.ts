import * as SQLite from "expo-sqlite";
import { Entry } from "./Entry";

const db = SQLite.openDatabaseSync("daytracker.db");

export function initDB() {
  db.withTransactionSync(() => {
    // Create entries table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY NOT NULL,
            date TEXT NOT NULL,
            text TEXT,
            perks TEXT -- JSON encoded array
            );`
    );

    // Insert dummy data if table is empty
    const result = db.getAllSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM entries;`
    );
    if (result[0]?.count === 0) {
      db.runSync(
        `INSERT INTO entries (id, date, text, perks) VALUES (?, ?, ?, ?);`,
        "1",
        "2025-05-28",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        JSON.stringify(["nutrition", "reading"])
      );
    }
  });
}

// Fetch all day entries
export async function getAllEntries(): Promise<Entry[]> {
  try {
    return await db.getAllAsync<Entry>(`SELECT * FROM entries;`);
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Fetch one specific day entry

// Add a new entry
export function createEntry(entry: Entry): void {}

// Update existing entry
export function updateEntry(entry: Entry): void {}

// Delete existing entry
export function deleteEntry(entry: Entry): void {}
