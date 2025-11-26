import { eq } from "drizzle-orm";
import { Entry, Perk } from "../Models";
import { entryPerks } from "../Schema";
import { DBClient } from "../Utilities/TransactionUtil";
import { db } from "../Services/DataService";


export async function create(entry: Entry, perks: Perk[], dbClient: DBClient = db): Promise<void> {
    await dbClient.insert(entryPerks).values(
        perks.map(perk => ({
            entryId: entry.id,
            perkId: perk.id
        }))
    );
}

export async function remove(entry: Entry, dbClient: DBClient = db) {
    await dbClient.delete(entryPerks).where(eq(entryPerks.entryId, entry.id));
}
