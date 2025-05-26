import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { users, books, readingStatuses, type NewUser, type NewBook, type NewReadingStatus } from '../db/schema'; // Adjust path as needed

// Fixture for a user
export const userFixture: NewUser = {
  id: 'test-user-1',
  username: 'Test User 1',
  email: 'test.user1@example.com',
  // Add other required fields, ensure they match your schema
  // e.g., provider: 'email', passwordHash: 'hashed_password'
  // For simplicity, assuming id, username, email are core fields.
  // Adjust based on your actual schema constraints (NOT NULL, etc.)
};

// Fixture for a book
export const bookFixture: NewBook = {
  id: 'test-book-1',
  title: 'Test Book 1: The Adventure of Testing',
  author: 'Dr. Tester',
  isbn: '9780123456789',
  // Add other required fields
  // e.g., publisher: 'Test Publications', publishedDate: '2023-01-01',
  // coverImage: 'http://example.com/cover.jpg'
  // thumbnail: 'http://example.com/thumbnail.jpg'
};

// Fixture for a reading status
export const readingStatusFixture: NewReadingStatus = {
  // id will be auto-generated if it's a serial/auto-increment type
  userId: userFixture.id, // Link to the user fixture
  bookId: bookFixture.id, // Link to the book fixture
  status: 'read', // Example status, adjust to your defined statuses
  // Add other required fields
  // e.g., startedAt: new Date(), finishedAt: new Date()
};


// Function to seed the database with common fixtures
export async function seedDatabase(db: BetterSQLite3Database<typeof import('../db/schema')>) {
  // Insert user
  // Note: If your schema has auto-incrementing primary keys and you don't specify an ID,
  // Drizzle will handle it. If IDs are UUIDs or otherwise generated, ensure they are provided.
  await db.insert(users).values(userFixture).onConflictDoNothing().execute();

  // Insert book
  await db.insert(books).values(bookFixture).onConflictDoNothing().execute();

  // Insert reading status
  // Ensure user and book exist before inserting reading status if there are foreign key constraints
  const userExists = await db.select().from(users).where(eq(users.id, userFixture.id)).limit(1);
  const bookExists = await db.select().from(books).where(eq(books.id, bookFixture.id)).limit(1);

  if (userExists.length > 0 && bookExists.length > 0) {
    await db.insert(readingStatuses).values(readingStatusFixture).onConflictDoNothing().execute();
  } else {
    console.warn('Skipping reading status seeding due to missing user or book.');
  }

  // You can add more fixtures and seeding logic here
  // For example, creating multiple users, books, etc.

  console.log('Database seeded with fixtures.');
}

// Helper to quickly insert a specific user
export async function insertUser(db: BetterSQLite3Database<typeof import('../db/schema')>, userData: NewUser) {
  return db.insert(users).values(userData).returning().execute();
}

// Helper to quickly insert a specific book
export async function insertBook(db: BetterSQLite3Database<typeof import('../db/schema')>, bookData: NewBook) {
  return db.insert(books).values(bookData).returning().execute();
}

// Helper to quickly insert a specific reading status
export async function insertReadingStatus(db: BetterSQLite3Database<typeof import('../db/schema')>, statusData: NewReadingStatus) {
  // Ensure related user and book exist if not handled by DB schema (e.g. ON CONFLICT DO NOTHING)
  return db.insert(readingStatuses).values(statusData).returning().execute();
}

// Import `eq` if you use it in `seedDatabase` or other functions
import { eq } from 'drizzle-orm';
