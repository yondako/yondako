import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
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

export function clearDatabase(db: ReturnType<typeof drizzle>, sqlite: Database.Database) {
  // This is a simple way to clear the in-memory database.
  // For persistent databases, you might need to drop tables or truncate them.
  sqlite.close(); // Close the current connection
  const newSqlite = new Database(':memory:'); // Create a new in-memory database
  const newDb = drizzle(newSqlite, { schema });
  migrate(newDb, { migrationsFolder }); // Re-apply migrations
  return { db: newDb, sqlite: newSqlite };
}
