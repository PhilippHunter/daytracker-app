import { asc, desc, eq, max } from "drizzle-orm";
import { db } from "./DataService";
import { Entry, Person } from "./Models";
import { entries, entryPersons, persons } from "./Schema";

// get all persons for mention suggestions
export async function getAllPersons(): Promise<Person[]> {
    return await db.query.persons.findMany();
}

// get all persons sorted by last mention
export async function getAllPersonsSorted(): Promise<Person[]> {
    return await db
        .select({
            id: persons.id,
            name: persons.name,
            description: persons.description,
            lastMention: max(entries.date)
        })
        .from(persons)
        .leftJoin(entryPersons, eq(persons.id, entryPersons.personId))
        .leftJoin(entries, eq(entryPersons.entryId, entries.id))
        .groupBy(persons.id)
        .orderBy(desc(entries.date))
}

// get specific person by id
export async function getPerson(id: number): Promise<Person | undefined> {
    return await db.query.persons.findFirst({
        where: eq(persons.id, id)
    });
}

// get last 10 entries by mentioned person
export async function getMentionsByPerson(id: number, page: number = 0): Promise<Omit<Entry, "perks" | "mentions">[]> {
    const pageSize = 5;
    const result = await db
        .select({
            id: entries.id,
            date: entries.date,
            text: entries.text,
        })
        .from(entryPersons)
        .innerJoin(entries, eq(entryPersons.entryId, entries.id))
        .where(eq(entryPersons.personId, id))
        .orderBy(desc(entries.date))
        .limit(pageSize)
        .offset(page * pageSize);

    console.log("RECENT MENTIONS: ", result);

    return result;
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

// update person fields (e.g. description)
export async function updatePerson(id: number, patch: Partial<Person>): Promise<Person | undefined> {
    if (Object.keys(patch).length === 0) return getPerson(id);

    await db.update(persons).set(patch).where(eq(persons.id, id));
    return getPerson(id);
}