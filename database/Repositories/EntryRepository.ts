import { eq } from "drizzle-orm";
import { Entry } from "../Models";
import { entries } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";
import { db } from "../Services/DataService";

const relations: Parameters<typeof db.query.entries.findFirst>[0] = {
  with: {
    entryPerks: {
      columns: {
        entryId: false,
        perkId: false,
      },
      with: {
        perk: true
      }
    },
    entryPersons: {
      columns: {
        entryId: false,
        personId: false
      },
      with: {
        person: true
      }
    }
  }
};

export async function getAll(dbClient: DBClient = db): Promise<Entry[]> {
    return await dbClient.query.entries.findMany(relations);
}

export async function find(id: number, dbClient: DBClient = db): Promise<Entry | undefined> {
    return await dbClient.query.entries.findFirst({
        ...relations,
        where: eq(entries.id, id)
    });
}

export async function findByDate(date: string, dbClient: DBClient = db): Promise<Entry | undefined> {
    return await dbClient.query.entries.findFirst({
        ...relations,
        where: eq(entries.date, date)
    });
}

export async function create(entry: Entry, dbClient: DBClient = db): Promise<Entry> {
    const [insertedEntry] = await dbClient
        .insert(entries)
        .values({
          date: entry.date,
          text: entry.text
        })
        .returning();
    return insertedEntry;
}

export async function update(id: number, patch: Partial<Entry>, dbClient: DBClient = db): Promise<Entry | undefined> {
    const result = await dbClient.update(entries).set(patch).where(eq(entries.id, id)).returning();
    if (result.length < 1) {
        throw new Error("No Entry row has been updated.");
    }
    return result[0];
}

export async function remove(id: number, dbClient: DBClient = db): Promise<void> {
    await dbClient.delete(entries).where(eq(entries.id, id));
}