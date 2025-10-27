import { eq } from "drizzle-orm";
import { db } from "./DataService";
import { Entry, Person } from "./Models";
import { entries, entryPersons, persons } from "./Schema";

// get all persons for mention suggestions
export async function getAllPersons(): Promise<Person[]> {
    return await db.query.persons.findMany();
}

// get all mentions for specific person

// get all mentions for specific entry

// save mentions to entry
export async function saveMentionsToEntry(uniqueMentionNames: string[], entry: Entry): Promise<void> {
    // remove existing mentions if any
    await db.delete(entryPersons).where(eq(entryPersons.entryId, entry.id));

    if (uniqueMentionNames.length == 0 || !entry.text) return;

    // find unique linked persons
    const linkedPersons: Person[] = [];
    for (const mentionName of uniqueMentionNames) {
        let personToLink = await db.query.persons.findFirst({
            where: eq(persons.name, mentionName)
        });
        // create person if not exists
        if (!personToLink) {
            [personToLink] = await db.insert(persons).values({
                name: mentionName
            }).returning();
        }
        linkedPersons.push(personToLink);
    }
    if (linkedPersons.length !== uniqueMentionNames.length) {
        throw new Error("Not all linked persons could be retreived or created.");
    }

    // link persons with entry
    await db.insert(entryPersons).values(linkedPersons.map((person) => ({
        entryId: entry.id,
        personId: person.id
    })));

    // re-parse linked persons in entry text to make them appear formatted
    for (const linkedPerson of linkedPersons) {
        entry.text = entry.text?.replaceAll(
            `@${linkedPerson.name}`, 
            `{@}[${linkedPerson.name}](${linkedPerson.id})`
        );
    }
    await db.update(entries).set({
        text: entry.text
    }).where(eq(entries.id, entry.id));
}