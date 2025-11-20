import { asc, desc, eq, max } from "drizzle-orm";
import { db } from "./DataService";
import { Entry, Person, PersonWithLastMentionDTO } from "../Models";
import { entries, entryPersons, persons } from "../Schema";
import * as MentionRepo from "../Repositories/MentionRepository";
import * as MentionUtils from "../Utilities/MentionUtils";

// get all persons for mention suggestions
export async function getAllPersons(): Promise<Person[]> {
    return await db.query.persons.findMany();
}

// get all persons sorted by last mention
export async function getAllPersonsSorted(): Promise<PersonWithLastMentionDTO[]> {
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

// get last 10 entries for specific person
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

// save mentions to entry
export async function saveMentionsToEntry(uniqueMentionNames: string[], entry: Entry): Promise<void> {
    await db.transaction(async (tx) => {
        // remove existing mentions if any
        await MentionRepo.remove(entry.id, tx);
        
        if (uniqueMentionNames.length == 0 || !entry.text) return;
        
        // find or create linked persons
        const linkedPersons = await MentionRepo.findOrCreatePersons(uniqueMentionNames, tx);
        
        // link persons with entry
        await MentionRepo.create(linkedPersons, entry, tx);
        
        // re-parse linked persons in entry text to make them appear formatted
        entry.text = MentionUtils.encodeLinkedPersonsInText(linkedPersons, entry.text);
        // TODO: move to entry repo
        await tx.update(entries).set({
            text: entry.text
        }).where(eq(entries.id, entry.id));
    })
}

// update person fields (e.g. description)
export async function updatePerson(id: number, patch: Partial<Person>): Promise<Person | undefined> {
    if (Object.keys(patch).length === 0) return getPerson(id);
    
    return await MentionRepo.updatePerson(id, patch);
}