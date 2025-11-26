import { db } from "./DataService";
import { Entry, EntryWithRelations } from "../Models";
import * as EntryRepo from "../Repositories/EntryRepository";
import * as EntryPerkRepo from "../Repositories/EntryPerkRepository";
import * as MentionUtils from "../Utilities/MentionUtils";
import * as MentionService from "../Services/MentionService";

// TODO: rework with new Repository structure

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


// Fetch all entries for calendar view
// TODO: think about neccesity of this extra load func
export async function getAllEntriesForOverview() : Promise<Omit<EntryWithRelations, "text">[]> {
  try {
    // Get all entries (without text)
    const result = await db.query.entries.findMany({
      ...relations,
      columns: {
        id: true,
        date: true,
        text: false
      }
    });

    return result.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error("Failed to fetch entries for overview: ", error);
    throw error;
  }
}

// Fetch all day entries
export async function getAllEntries(): Promise<EntryWithRelations[]> {
  try {
    const result = await EntryRepo.getAll();
    return result.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Fetch one specific day entry
export async function getEntry(dateString: string): Promise<EntryWithRelations | null> {
  try {
    // Fetch the entry by date
    const entry = await EntryRepo.findByDate(dateString);

    return mapEntry(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with date ${dateString}: `, error);
    throw error;
  }
}

// Fetch one specific day entry by id
async function getEntryById(id: number): Promise<EntryWithRelations | null> {
  try {
    // Fetch the entry by id
    const entry = await EntryRepo.find(id);

    return mapEntry(entry);
  } catch(error) {
    console.error(`Failed to fetch Entry with id ${id}: `, error);
    throw error;
  }
}

// Add a new entry
// TODO: add perk validation (existence)
// TODO: add field validation (full Entry field must be provided)
export async function createEntry(entry: EntryWithRelations): Promise<EntryWithRelations> {
  try {
    let insertedEntryId: number | null = null;
    await db.transaction(async (tx) => {
      // insert whole entry into entries table
      const insertedEntry = await EntryRepo.create(entry, tx);

      // insert entry.perks into entryPerks relation (entry_perks table)
      if (insertedEntry && entry.perks && entry.perks.length != 0) {
        await EntryPerkRepo.create(insertedEntry, entry.perks, tx);
      }
      insertedEntryId = insertedEntry.id;
  
      // handle mentions in text
      if (entry.text) {
        const uniqueMentionNames = MentionUtils.extractUniqueMentions(entry.text);
        console.log("MENTIONS: ", uniqueMentionNames);
        await MentionService.saveMentionsToEntry(uniqueMentionNames, insertedEntry);
      }
    });
    if (!insertedEntryId) {
      throw new Error("Failed to create entry.");
    }

    // fetch newly created entry outside the transaction
    const created = await getEntryById(insertedEntryId);
    if (!created) {
      throw new Error("Failed to fetch created entry.");
    }
    return created;
  } catch (error) {
    console.error(`Failed to create Entry with date ${entry.date}: `, error)
    throw error;
  }
}

// Update existing entry
// TODO: maybe restructure entryPipeline into here, so that everything starts in the service
export async function updateEntry(entry: EntryWithRelations): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // update entry
      await EntryRepo.update(entry.id, entry, tx);
    
      // delete related perks
      await EntryPerkRepo.remove(entry, tx);

      // re-add related perks
      if (entry.perks && entry.perks.length != 0) {
        await EntryPerkRepo.create(entry, entry.perks, tx);
      }

      // handle mentions in text
      if (entry.text) {
          const uniqueMentionNames = MentionUtils.extractUniqueMentions(entry.text);
          console.log("MENTIONS: ", uniqueMentionNames);
          await MentionService.saveMentionsToEntry(uniqueMentionNames, entry);
      }
    });
  } catch (error) {
    console.error(`Failed to update Entry with date ${entry.date}: `, error)
    throw error;
  }
}

// Delete existing entry
export async function deleteEntry(entry: Entry): Promise<void> {
  try {
    await EntryRepo.remove(entry.id);
  } catch (error) {
    console.error(`Failed to update Entry with date ${entry.date}: `, error)
    throw error;
  }
}

function mapEntry(inputEntry: any): EntryWithRelations {
  if (!inputEntry) return inputEntry;

  return {
    ...inputEntry,
    perks: inputEntry.entryPerks.map((ep: any) => ep.perk),
    mentions: inputEntry.entryPersons.map((ep: any) => ep.person)
  } as EntryWithRelations;
}