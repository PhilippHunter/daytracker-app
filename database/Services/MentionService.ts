import { asc, desc, eq, max } from "drizzle-orm";
import { db } from "./DataService";
import { Entry, Person, PersonWithLastMentionDTO } from "../Models";
import { entries, entryPersons, persons } from "../Schema";
import * as MentionRepo from "../Repositories/MentionRepository";
import * as MentionUtils from "../Utilities/MentionUtils";
import * as PersonRepo from "../Repositories/PersonRepository";
import * as EntryRepo from "../Repositories/EntryRepository";
import { DBClient } from "../Utilities/TransactionUtil";

// get all persons for mention suggestions
export async function getAllPersons(sorted: boolean = false): Promise<Person[] | PersonWithLastMentionDTO[]> {
    if (!sorted)
        return await PersonRepo.getAll();
    else 
        return await PersonRepo.getAllSorted();
}


// get last x entries for specific person
export async function getMentionsByPerson(id: number, page: number = 0): Promise<Omit<Entry, "perks" | "mentions">[]> {
    return await MentionRepo.find(id, page);
}

export async function find(personId: number, dbClient: DBClient = db): Promise<Person | undefined> {
    return await PersonRepo.find(personId);
}

// save mentions to entry
export async function saveMentionsToEntry(uniqueMentionNames: string[], entry: Entry): Promise<void> {
    await db.transaction(async (tx) => {
        // remove existing mentions if any
        await MentionRepo.remove(entry.id, tx);
        
        if (uniqueMentionNames.length == 0 || !entry.text) return;
        
        // find or create linked persons
        const linkedPersons = await PersonRepo.findOrCreate(uniqueMentionNames, tx);
        
        // link persons with entry
        await MentionRepo.create(linkedPersons, entry, tx);
        
        // re-parse linked persons in entry text to make them appear formatted
        entry.text = MentionUtils.encodeLinkedPersonsInText(linkedPersons, entry.text);
        await EntryRepo.update(entry.id, entry, tx);
    })
}

// update person fields (e.g. description)
export async function updatePerson(id: number, patch: Partial<Person>): Promise<Person | undefined> {
    if (Object.keys(patch).length === 0) return PersonRepo.find(id);

    return await PersonRepo.update(id, patch);
}