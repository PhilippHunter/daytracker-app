import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "../Services/DataService";
import { Entry, Person } from "../Models";
import { entryPersons, persons } from "../Schema";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { ExpoSQLiteDatabase, ExpoSQLiteTransaction } from "drizzle-orm/expo-sqlite";
import { SQLiteRunResult } from "expo-sqlite";

type SchemaDef = typeof import("../Schema");

// for transactional repo methods
// specify db client to be either the top-level ExpoSQLiteDatabase or a transaction wrapper
type DBClient = ExpoSQLiteDatabase<SchemaDef> | SQLiteTransaction<"sync", SQLiteRunResult, SchemaDef, ExtractTablesWithRelations<SchemaDef>>;

export async function remove(id: number, dbClient: DBClient = db): Promise<void> {
    await dbClient.delete(entryPersons).where(eq(entryPersons.entryId, id));
}

export async function create(linkedPersons: Person[], entry: Entry, dbClient: DBClient = db): Promise<void> {
    await dbClient.insert(entryPersons).values(linkedPersons.map((person) => ({
        entryId: entry.id,
        personId: person.id
    })));
}

export async function findOrCreatePersons(uniqueMentionNames: string[], dbClient: DBClient = db): Promise<Person[]> {
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

export async function updatePerson(id: number, patch: Partial<Person>, dbClient: DBClient = db): Promise<Person> {
    const result = await dbClient.update(persons).set(patch).where(eq(persons.id, id)).returning();
    if (result.length < 1) {
        throw new Error("No Person row has been updated.");
    }
    return result[0];
}