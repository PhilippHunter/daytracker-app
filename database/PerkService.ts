import { db } from "./DataService";
import { Perk } from "./Models";
import { perks } from './Schema';
import { eq } from "drizzle-orm";


// Get available perks
export async function getAllPerks(): Promise<Perk[]> {
  try {
    return await db.query.perks.findMany();
  } catch (error) {
    console.error("Failed to fetch entries: ", error);
    throw error;
  }
}

// Get Perk by id helper
async function getPerkById(id: number): Promise<Perk | null> {
  try {
    const result = await db.query.perks
      .findFirst({
        where: eq(perks.id, id)
      });

    if (!result) return null;
    return result;
  } catch (error) {
    console.error(`Failed to fetch perk with id ${id}: `, error);
    throw error;
  }
}

// Update specific Perk
export async function updatePerk(perk: Perk): Promise<void> {
  try {
    await db.update(perks).set({
      title: perk.title,
      color: perk.color,
      icon: perk.icon
    }).where(eq(perks.id, perk.id));
  } catch (error) {
    console.error(`Failed to update Perk with id ${perk.id}: `, error);
    throw error;
  }
}

// Create new Perk
export async function createPerk(perk: Perk): Promise<Perk> {
  try {
    const [result] = await db.insert(perks).values({
      title: perk.title,
      color: perk.color,
      icon: perk.icon
    }).returning();
    
    return result;
  } catch (error) {
    console.error(`Failed to create perk with title ${perk.title}: `, error);
    throw error;
  }
}

// Delete existing Perk
export async function deletePerk(perk: Perk): Promise<void> {
  try {
    await db.delete(perks).where(eq(perks.id, perk.id));
  } catch (error) {
    console.error(`Failed to update Perk with title ${perk.title}: `, error)
    throw error;
  }
}
