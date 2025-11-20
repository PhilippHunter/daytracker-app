import { eq } from "drizzle-orm";
import { db } from "../Services/DataService";
import { Entry, Person } from "../Models";
import { entryPersons, persons } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";

export async function remove(id: number, dbClient: DBClient = db): Promise<void> {
    await dbClient.delete(entryPersons).where(eq(entryPersons.entryId, id));
}

export async function create(linkedPersons: Person[], entry: Entry, dbClient: DBClient = db): Promise<void> {
    await dbClient.insert(entryPersons).values(linkedPersons.map((person) => ({
        entryId: entry.id,
        personId: person.id
    })));
}