import { Database } from 'bun:sqlite'; // Import Database from bun:sqlite
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'; // Import drizzle and BunSQLiteDatabase from bun-sqlite
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'; // Import migrate from bun-sqlite migrator
import * as schema from '../db/schema';

// Path to the migrations folder
const migrationsFolder = './src/db/migrations';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });

  // Apply migrations
  migrate(db, { migrationsFolder });

  return { db, sqlite };
}

export function clearDatabase(currentDb: BunSQLiteDatabase<typeof schema>, currentSqlite: Database) {
  // This is a simple way to clear the in-memory database.
  // For bun:sqlite, closing and reopening a new in-memory DB is the most straightforward way.
  currentSqlite.close(); // Close the current connection
  const newSqlite = new Database(':memory:'); // Create a new in-memory database
  const newDb = drizzle(newSqlite, { schema });
  migrate(newDb, { migrationsFolder }); // Re-apply migrations
  return { db: newDb, sqlite: newSqlite };
}
