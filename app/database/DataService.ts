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
    const entries = await db.getAllAsync<Entry>(`SELECT * FROM entries;`);
    return entries.map((entry) => { 
        return {
            ...entry,
            // parse JSON array for perks (change to db relation later)
            perks: Array.isArray(entry.perks) ? entry.perks : JSON.parse(entry.perks ?? "[]")
        };
    });
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Fetch one specific day entry
export async function getEntry(dateString: string): Promise<Entry | null> {
    try {
        const entry = await db.getFirstAsync<Entry>(
            `SELECT * FROM entries WHERE date = ?`, 
            dateString
        );
        if (!entry) return null;
        return {
            ...entry,
            // parse JSON array for perks (change to db relation later)
            perks: Array.isArray(entry.perks) ? entry.perks : JSON.parse(entry?.perks ?? "[]")
        };
    } catch(error) {
        console.error(`Failed to fetch Entry with date ${dateString}: `, error);
        throw error;
    }
}

// Add a new entry
export function createEntry(entry: Entry): void {}

// Update existing entry
export function updateEntry(entry: Entry): void {}

// Delete existing entry
export function deleteEntry(entry: Entry): void {}
