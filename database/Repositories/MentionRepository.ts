import { eq } from "drizzle-orm";
import { db } from "../Services/DataService";
import { Person } from "../Models";
import { persons } from "../Schema";

type DBClient = typeof db | any; // passt für Drizzle tx auch (allow transaction objects)

export async function findOrCreatePersonsFromMentionNames(uniqueMentionNames: string[], dbClient: DBClient = db): Promise<Person[]> {
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