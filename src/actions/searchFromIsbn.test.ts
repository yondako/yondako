import { describe, it, expect, vi, mock, beforeEach, afterEach } from 'bun:test';
import { searchFromIsbn } from './searchFromIsbn';
import { createFreshTestDb } from '../db'; // Adjusted path
import type { BookNDL } from '../lib/ndl'; // Adjusted path
import type { ReadingStatus } from '../types/readingStatus'; // Adjusted path
import type { User } from '../db/schema/user'; // Adjusted path
import type { BookType } from '@/types/book';

// --- Mocks ---
// Mock next/headers
mock.module('next/headers', () => ({
  headers: () => new Headers(),
}));
// Mock getCloudflareContext
mock.module('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}));

// Mock getAuth and its session logic
mock.module('../lib/auth', () => ({
  getAuth: vi.fn(),
}));

// Mock NDL search function
mock.module('../lib/ndl', () => ({
  searchBooksFromNDL: vi.fn(),
}));

// Mock DB query for statuses (alternative to seeding for this specific test)
mock.module('../db/queries/status', () => ({
  getStatusesByBookIds: vi.fn(),
}));
// --- End Mocks ---

// Helper to import mocked functions for typing and control
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getAuth } from '../lib/auth';
import { searchBooksFromNDL } from '../lib/ndl';
import { getStatusesByBookIds } from '../db/queries/status';


describe('Action: searchFromIsbn', () => {
  let mockDb: ReturnType<typeof createFreshTestDb>['db'];
  let mockSqlite: ReturnType<typeof createFreshTestDb>['sqlite'];

  const mockUser: User = {
    id: 'test-user-id',
    username: 'Test User',
    email: 'test@example.com',
    // Add other necessary fields from your User schema
    provider: null,
    isAdmin: false,
    description: null,
    image: null,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockBookNDL: BookNDL = {
    title: 'Test Book from NDL',
    author: 'NDL Author',
    isbn: '9781234567890',
    // Add other necessary fields from BookNDL type
    publisher: 'NDL Publisher',
    pubDate: '2023',
    seriesTitle: '',
    volume: '',
    itemCaption: '',
    contributor: '',
    creator: '',
    titleTranscription: '',
    creatorTranscription: '',
    subject: '',
    ndc: '',
    price: '',
    extent: '',
    description: '',
    isbn10: '',
    imageUrl: '',
  };

  beforeEach(() => {
    const { db, sqlite } = createFreshTestDb();
    mockDb = db;
    mockSqlite = sqlite;

    // Setup getCloudflareContext mock
    (getCloudflareContext as ReturnType<typeof vi.fn>).mockReturnValue({
      env: { DB: mockDb /* This would be the D1DatabaseLike object from better-sqlite3 */ },
    });

    // Setup getAuth mock
    const mockAuthInstance = {
      api: {
        getSession: vi.fn(),
      },
    };
    (getAuth as ReturnType<typeof vi.fn>).mockReturnValue(mockAuthInstance);
  });

  afterEach(() => {
    mockSqlite.close(); // Close the in-memory database after each test
    // vi.resetAllMocks(); // Replaced with clearAllMocks or individual resets
    vi.clearAllMocks(); 
    // If vi.clearAllMocks() is not available or doesn't work, reset mocks individually:
    // (getCloudflareContext as ReturnType<typeof vi.fn>).mockClear();
    // (getAuth as ReturnType<typeof vi.fn>).mockClear();
    // // For functions returned by vi.fn() within other mocks, e.g., getAuth().api.getSession
    // const authInstance = getAuth(null as any); // Get instance to reset its methods
    // if (authInstance && authInstance.api && typeof authInstance.api.getSession.mockClear === 'function') {
    //   authInstance.api.getSession.mockClear();
    // }
    // (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockClear();
    // (getStatusesByBookIds as ReturnType<typeof vi.fn>).mockClear();
  });

  it('should return undefined if user is not authenticated', async () => {
    // Mock getSession to return no user
    const mockAuthApi = getAuth(mockDb).api;
    (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await searchFromIsbn('9781234567890');
    expect(result).toBeUndefined();
    expect(searchBooksFromNDL).not.toHaveBeenCalled();
  });

  it('should return undefined if NDL search finds no books', async () => {
    // Mock getSession to return a user
    const mockAuthApi = getAuth(mockDb).api;
    (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, session: {} as any });

    // Mock NDL search to return no books
    (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockResolvedValue({ books: [], total: 0, url: '' });

    const result = await searchFromIsbn('9781234567890');
    expect(result).toBeUndefined();
    expect(searchBooksFromNDL).toHaveBeenCalledWith({ count: 1, params: { isbn: '9781234567890' } });
    expect(getStatusesByBookIds).not.toHaveBeenCalled(); // Added this assertion
  });

  it('should return book with reading status "none" if not in library', async () => {
    // Mock getSession
    const mockAuthApi = getAuth(mockDb).api;
    (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, session: {} as any });

    // Mock NDL search
    (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockResolvedValue({
      books: [mockBookNDL],
      total: 1,
      url: '',
    });

    // Mock getStatusesByBookIds to return empty array (book not in library)
    (getStatusesByBookIds as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await searchFromIsbn(mockBookNDL.isbn);

    expect(searchBooksFromNDL).toHaveBeenCalledWith({ count: 1, params: { isbn: mockBookNDL.isbn } });
    expect(getStatusesByBookIds).toHaveBeenCalledWith(mockDb, mockUser.id, [mockBookNDL]);
    expect(result).toEqual<BookType>({ // Make sure to use BookType for the expected shape
      detail: mockBookNDL,
      readingStatus: 'none',
    });
  });

  it('should return book with its correct reading status if found in library', async () => {
    const readingStatus: ReadingStatus = 'reading';
    // Mock getSession
    const mockAuthApi = getAuth(mockDb).api;
    (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, session: {} as any });

    // Mock NDL search
    (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockResolvedValue({
      books: [mockBookNDL],
      total: 1,
      url: '',
    });

    // Mock getStatusesByBookIds to return the book with a status
    (getStatusesByBookIds as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        // This structure depends on what getStatusesByBookIds actually returns
        // Assuming it's an array of objects, each having the book and its status
        ...mockBookNDL, // Spread the book details if they are part of the return structure
        bookId: mockBookNDL.isbn, // Or whatever ID is used
        userId: mockUser.id,
        readingStatus: readingStatus,
        // Add other fields returned by getStatusesByBookIds
      },
    ]);

    const result = await searchFromIsbn(mockBookNDL.isbn);

    expect(getStatusesByBookIds).toHaveBeenCalledWith(mockDb, mockUser.id, [mockBookNDL]);
    expect(result).toEqual<BookType>({
      detail: mockBookNDL,
      readingStatus: readingStatus,
    });
  });
});
