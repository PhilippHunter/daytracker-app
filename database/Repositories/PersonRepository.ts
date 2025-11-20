import { eq } from "drizzle-orm";
import { db } from "../Services/DataService";
import { Person } from "../Models";
import { persons } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";

export async function find(id: number): Promise<Person | undefined> {
    return await db.query.persons.findFirst({
        where: eq(persons.id, id)
    });
}

export async function findOrCreate(uniqueMentionNames: string[], dbClient: DBClient = db): Promise<Person[]> {
    const linkedPersons: Person[] = [];
    for (const mentionName of uniqueMentionNames) {
        let personToLink = await dbClient.query.persons.findFirst({
            where: eq(persons.name, mentionName)
        });
        // create person if not exists
        if (!personToLink) {
            [personToLink] = await dbClient.insert(persons).values({
                name: mentionName
            }).returning();
        }
        linkedPersons.push(personToLink);
    }

    if (linkedPersons.length !== uniqueMentionNames.length) {
        throw new Error("Not all linked persons could be retreived or created.");
    }

    return linkedPersons;
}

export async function update(id: number, patch: Partial<Person>, dbClient: DBClient = db): Promise<Person> {
    const result = await dbClient.update(persons).set(patch).where(eq(persons.id, id)).returning();
    if (result.length < 1) {
        throw new Error("No Person row has been updated.");
    }
    return result[0];
}