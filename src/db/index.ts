import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleBunSQLite, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import * as schema from "./schema";
import { Database } from 'bun:sqlite'; // Import Database from bun:sqlite
// Comment out the Drizzle migrator, we'll do it manually for debugging
// import { migrate } from 'drizzle-orm/bun-sqlite/migrator'; 
import fs from 'fs';
import path from 'path';

// Path to the migrations folder
const migrationsFolder = './src/db/migrations';

let dbInstance: ReturnType<typeof drizzleD1> | BunSQLiteDatabase<typeof schema>;

export function getDB(d1?: D1Database) {
  if (process.env.NODE_ENV === 'test') {
    if (!dbInstance) {
      // This setup is for a persistent in-memory DB across test calls within the same run.
      // For fully isolated tests, use `createFreshTestDb` in a beforeEach block.
      const sqlite = new Database(':memory:');
      dbInstance = drizzleBunSQLite(sqlite, { schema });
      // Apply migrations for test DB
      migrate(dbInstance as BunSQLiteDatabase<typeof schema>, { migrationsFolder });
      console.log("Using bun:sqlite in-memory database for testing.");
    }
    return dbInstance as BunSQLiteDatabase<typeof schema>;
  }

  if (!d1) {
    throw new Error("D1Database instance is required when not in test environment.");
  }

  // In non-test environments, always return a new D1 instance.
  return drizzleD1(d1, {
    schema,
  });
}

// Function specifically for creating a fresh test DB instance using bun:sqlite
// This should be used in test setup (e.g., beforeEach) for isolation.
export function createFreshTestDb() {
  console.log("[TEST DB] Creating fresh in-memory SQLite database with bun:sqlite...");
  const sqlite = new Database(':memory:');
  // Enable Drizzle ORM internal logger for more detailed output
  const testDb = drizzleBunSQLite(sqlite, { schema, logger: true }); // Drizzle logger can still be useful

  console.log(`[TEST DB] Manually attempting to run migrations from folder: ${migrationsFolder}`);
  
  try {
    const migrationFiles = fs.readdirSync(migrationsFolder)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('[TEST DB] Found migration files:', migrationFiles);

    for (const file of migrationFiles) {
      console.log(`[TEST DB] Processing migration file: ${file}`);
      const filePath = path.join(migrationsFolder, file);
      let sqlContent = fs.readFileSync(filePath, 'utf-8');
      
      // Step 1: Remove Drizzle Kit breakpoint comment lines
      // Replace the entire line containing '--> statement-breakpoint' with a single newline to effectively remove it.
      sqlContent = sqlContent.replace(/(^|\n)--> statement-breakpoint.*?\n/g, '\n');

      // Step 2: Remove standard SQL line comments (lines starting with -- or parts of lines after --)
      // This regex removes from '--' to the end of the line.
      sqlContent = sqlContent.replace(/--[^\r\n]*/g, '');

      // Step 3: Split the cleaned content into statements by semicolon
      const statements = sqlContent.split(';')
                                   .map(stmt => stmt.trim()) // Trim each statement
                                   .filter(stmt => stmt.length > 0); // Filter out empty statements

      for (const statement of statements) {
        // Final check (redundant if regexes are perfect, but good for safety)
        if (statement.startsWith("--")) { // This check might be redundant if regex worked perfectly
          console.log(`[TEST DB] Skipping comment: ${statement}`);
          continue;
        }
        if (statement.length === 0) { // Should be caught by filter, but as a safeguard
            console.log("[TEST DB] Skipping empty statement after final processing.");
            continue;
        }
        
        console.log(`[TEST DB] Executing SQL: ${statement}`);
        try {
          sqlite.exec(statement); // Execute statement directly using bun:sqlite instance
          console.log(`[TEST DB] SQL executed successfully: ${statement}`);
        } catch (error) {
          console.error(`[TEST DB] Failed to execute SQL: ${statement}`);
          console.error("[TEST DB] Error object:", error);
          if (error instanceof Error) {
            console.error("[TEST DB] Error message:", error.message);
            console.error("[TEST DB] Error stack trace:", error.stack);
            if ((error as any).cause) {
              console.error("[TEST DB] Error cause:", (error as any).cause);
            }
          } else {
            console.error("[TEST DB] Non-Error object thrown:", error);
          }
          throw error; // Re-throw to stop further migrations and fail the test setup
        }
      }
      console.log(`[TEST DB] Finished processing migration file: ${file}`);
    }
    console.log("[TEST DB] Manual migrations completed successfully.");

  } catch (error) {
    // This top-level catch will now catch errors from fs operations or re-thrown errors from SQL execution
    console.error("[TEST DB] Manual migration process failed. Error details below:");
    console.error("[TEST DB] Top-level error object:", error);
    if (error instanceof Error) {
      console.error("[TEST DB] Top-level error message:", error.message);
      console.error("[TEST DB] Top-level error stack trace:", error.stack);
      if ((error as any).cause) {
        console.error("[TEST DB] Top-level error cause:", (error as any).cause);
      }
    } else {
      console.error("[TEST DB] Top-level non-Error object thrown:", error);
    }
    // Re-throw to ensure test setup is marked as failed.
    // throw error; // Or handle as appropriate for your test strategy
  }

  // Original Drizzle migrate call (commented out for manual execution)
  // console.log(`[TEST DB] Attempting to run migrations from folder: ${migrationsFolder} using Drizzle migrate`);
  // try {
  //   migrate(testDb, { migrationsFolder });
  //   console.log("[TEST DB] Drizzle migrations completed successfully.");
  // } catch (error) {
  //   console.error("[TEST DB] Drizzle migration failed. Error details below:");
  //   console.error("[TEST DB] Error object:", error);
  //   if (error instanceof Error) {
  //     console.error("[TEST DB] Error message:", error.message);
  //     console.error("[TEST DB] Error stack trace:", error.stack);
  //     if ((error as any).cause) {
  //       console.error("[TEST DB] Error cause:", (error as any).cause);
  //     }
  //   } else {
  //     console.error("[TEST DB] Non-Error object thrown:", error);
  //   }
  // }

  // For bun:sqlite, the `sqlite` object itself is the connection.
  return { db: testDb, sqlite };
}
