import * as SQLite from "expo-sqlite";
import { Entry, Perk } from "./Models";
import { defaultPerks } from "@/constants/Perks";
import { db } from "./DataService";

export async function getEntryTotalCount() {
  try {
    const result = await db.getAllAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM entries;`
    );

    return result[0]?.count;
  } catch (error) {
    console.log("Fetching entry count failed: ", error);
    throw error;
  }
}

export async function getHighestDayStreak(): Promise<number> {
  try {
    const result = await db.getAllAsync<{ date: string }>(
      `SELECT date FROM entries ORDER BY date ASC;`
    );
    const entryDates = result.map(row => new Date(row.date));
    return calcHighestDayStreak(entryDates);
  } catch (error) {
    console.log("Fetching highest day streak failed: ", error);
    throw error;
  }
}

function calcHighestDayStreak(entryDates: Date[]): number {
  if (entryDates.length === 0) return 0;
  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 0; i+1 < entryDates.length; i++) {   // go until prev last element and compare with last
    // compare day difference with prev day
    const diffInTime = entryDates[i + 1].getTime() - entryDates[i].getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    
    if (diffInDays == 1) {
      currentStreak++;
    } else if (diffInDays > 1) {
      if (maxStreak < currentStreak) {
        maxStreak = currentStreak;
      }
      currentStreak = 1;
    }
  }
  // Final check in case the streak is at the end
  if (currentStreak > maxStreak) {
    maxStreak = currentStreak;
  }
  // return maxStreak
  return maxStreak;
}