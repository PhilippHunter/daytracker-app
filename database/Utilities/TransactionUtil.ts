import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteRunResult } from "expo-sqlite";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

// for transactional repo methods
// specify db client to be either the top-level ExpoSQLiteDatabase or a transaction wrapper
export type SchemaDef = typeof import("../Schema");
export type DBClient = ExpoSQLiteDatabase<SchemaDef> | SQLiteTransaction<"sync", SQLiteRunResult, SchemaDef, ExtractTablesWithRelations<SchemaDef>>;
