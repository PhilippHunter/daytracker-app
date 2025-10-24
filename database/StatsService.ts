import * as SQLite from "expo-sqlite";
import { Entry, Perk, Person } from "./Models";
import { defaultPerks } from "@/constants/Perks";
import { db } from "./DataService";
import { entries, entryPersons, persons } from "./Schema";
import { asc, count, countDistinct, desc, eq } from "drizzle-orm";

export async function getEntryTotalCount() {
  try {
    const result = await db.query.entries.findMany();

    return result.length;
  } catch (error) {
    console.log("Fetching entry count failed: ", error);
    throw error;
  }
}

// TODO: Test this
export async function getHighestDayStreak(): Promise<number> {
  try {
    const result = await db.query.entries.findMany({
      orderBy: [asc(entries.date)]
    });
    const entryDates = result.map(row => new Date(row.date));
    return calcHighestDayStreak(entryDates);
  } catch (error) {
    console.log("Fetching highest day streak failed: ", error);
    throw error;
  }
}

export async function getClosestFriend(): Promise<Person | null> {
  try {
    let closestFriend = null;
    await db.transaction(async (tx) => {
      const result = await tx.select({ 
        id: entryPersons.personId, 
        count: count(entryPersons.personId)
      }).from(entryPersons)
        .groupBy(entryPersons.personId)
        .orderBy(({ count }) => desc(count));
      console.log(result);

      if (result.length != 0 && result[0].id) {
        closestFriend = await tx.query.persons.findFirst({
          where: eq(persons.id, result[0].id)
        })
      }
    });

    return closestFriend ?? null;
  } catch (error) {
    console.log("Fetching closest friend failed: ", error);
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