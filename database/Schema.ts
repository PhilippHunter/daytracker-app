import { relations } from 'drizzle-orm';
import { primaryKey } from 'drizzle-orm/sqlite-core';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

/**
 * Entries
 */
export const entries = sqliteTable('entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  text: text('text'),
});

export const entriesRelations = relations(entries, ({ many }) => ({
  entryPerks: many(entryPerks),
  entryPersons: many(entryPersons)
}));

/**
 * Perks
 */
export const perks = sqliteTable('perks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  color: text('color'),
  icon: text('icon'),
});

export const perksRelations = relations(perks, ({ many }) => ({
  entryPerks: many(entryPerks)
}));

/**
 * EntryPerks
 */
export const entryPerks = sqliteTable('entry_perks', {
    entryId: integer('entry_id').references(() => entries.id),
    perkId: integer('perk_id').references(() => perks.id),
  }, 
  (t) => [
    primaryKey({ columns: [t.entryId, t.perkId]})
]);

export const entryPerksRelations = relations(entryPerks, ({ one }) => ({
  entry: one(entries, {
    fields: [entryPerks.entryId],
    references: [entries.id]
  }),
  perk: one(perks, {
    fields: [entryPerks.perkId],
    references: [perks.id]
  })
}));

/**
 * Person
 */
export const persons = sqliteTable('person', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull()
  // evtl. aliases für mehrdeutige Erwähnung
})

export const personsRelations = relations(persons, ({ many }) => ({
  entryPersons: many(entryPersons)
}));

/**
 * EntryPersons (Mention)
 */
export const entryPersons = sqliteTable('entry_persons', {
    entryId: integer('entry_id').references(() => entries.id),
    personId: integer('person_id').references(() => persons.id),
  }, 
  (t) => [
    primaryKey({ columns: [t.entryId, t.personId]})
]);

export const entryPersonsRelations = relations(entryPersons, ({ one }) => ({
  entry: one(entries, {
    fields: [entryPersons.entryId],
    references: [entries.id]
  }),
  person: one(persons, {
    fields: [entryPersons.personId],
    references: [persons.id]
  })
}));