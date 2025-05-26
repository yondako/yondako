import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleBetterSQLite3, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from "./schema";
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Path to the migrations folder - adjust if your folder structure is different
const migrationsFolder = './src/db/migrations';

let dbInstance: ReturnType<typeof drizzleD1> | BetterSQLite3Database<typeof schema>;

export function getDB(d1?: D1Database) {
  if (process.env.NODE_ENV === 'test') {
    if (!dbInstance) {
      // This setup is for a persistent in-memory DB across test calls within the same run (if needed)
      // For fully isolated tests, you might initialize this in a beforeEach block.
      const sqlite = new Database(':memory:');
      dbInstance = drizzleBetterSQLite3(sqlite, { schema });
      // Apply migrations for test DB
      migrate(dbInstance as BetterSQLite3Database<typeof schema>, { migrationsFolder });
      console.log("Using in-memory SQLite database for testing.");
    }
    return dbInstance as BetterSQLite3Database<typeof schema>;
  }

  if (!d1) {
    throw new Error("D1Database instance is required when not in test environment.");
  }

  // In non-test environments, always return a new D1 instance, or cache as appropriate
  // For simplicity here, returning a new instance each time.
  // If you have a global D1 instance elsewhere, you might use that.
  return drizzleD1(d1, {
    schema,
  });
}

// Optional: A function specifically for creating a fresh test DB instance
// This can be used in test setup (e.g., beforeEach) for isolation.
export function createFreshTestDb() {
  const sqlite = new Database(':memory:');
  const testDb = drizzleBetterSQLite3(sqlite, { schema });
  migrate(testDb, { migrationsFolder });
  return { db: testDb, sqlite }; // Return sqlite instance for potential direct manipulation or closing
}
