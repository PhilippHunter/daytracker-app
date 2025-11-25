import { eq } from "drizzle-orm";
import { Entry } from "../Models";
import { entries } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";
import { db } from "../Services/DataService";

// TODO: rework EntryService

export async function update(id: number, patch: Partial<Entry>, dbClient: DBClient = db): Promise<Entry | undefined> {
    const result = await dbClient.update(entries).set(patch).where(eq(entries.id, id)).returning();
        if (result.length < 1) {
            throw new Error("No Person row has been updated.");
        }
    return result[0];
}