import { relations } from 'drizzle-orm';
import { primaryKey } from 'drizzle-orm/sqlite-core';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const entries = sqliteTable('entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  text: text('text'),
});

export const entriesRelations = relations(entries, ({ many }) => ({
  entryPerks: many(entryPerks)
}));

export const perks = sqliteTable('perks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  color: text('color'),
  icon: text('icon'),
});

export const perksRelations = relations(perks, ({ many }) => ({
  entryPerks: many(entryPerks)
}));

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
