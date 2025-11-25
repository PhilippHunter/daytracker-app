import { desc, eq } from "drizzle-orm";
import { db } from "../Services/DataService";
import { Entry, Person } from "../Models";
import { entries, entryPersons, persons } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";

export async function find(personId: number, page: number = 0, dbClient: DBClient = db): Promise<Omit<Entry, "perks" | "mentions">[]> {
    const pageSize = 5;
    return await db
        .select({
            id: entries.id,
            date: entries.date,
            text: entries.text,
        })
        .from(entryPersons)
        .innerJoin(entries, eq(entryPersons.entryId, entries.id))
        .where(eq(entryPersons.personId, personId))
        .orderBy(desc(entries.date))
        .limit(pageSize)
        .offset(page * pageSize);
}

export async function remove(id: number, dbClient: DBClient = db): Promise<void> {
    await dbClient.delete(entryPersons).where(eq(entryPersons.entryId, id));
}

export async function create(linkedPersons: Person[], entry: Entry, dbClient: DBClient = db): Promise<void> {
    await dbClient.insert(entryPersons).values(linkedPersons.map((person) => ({
        entryId: entry.id,
        personId: person.id
    })));
}