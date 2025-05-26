import { describe, it, expect, vi, mock, beforeEach, afterEach } from 'bun:test';
import { updateReadingStatus } from './updateReadingStatus';
import { createFreshTestDb } from '../db';
import type { BookIdentifiers, Book as BookSchemaType } from '../db/schema'; // Assuming BookIdentifiers is from schema or a shared type
import type { ReadingStatus as ReadingStatusType } from '../types/readingStatus';
import type { User } from '../db/schema/user';
import type { BookNDL } from '../lib/ndl';
import type { BookType } from '../types/book'; // For the expected return structure

// --- Mocks ---
// Mock next/headers
mock.module('next/headers', () => ({
  headers: () => new Headers(),
}));
mock.module('@opennextjs/cloudflare', () => ({ getCloudflareContext: vi.fn() }));
mock.module('../lib/auth', () => ({ getAuth: vi.fn() }));
mock.module('../db/queries/book', () => ({ fetchBook: vi.fn(), createBook: vi.fn() }));
mock.module('../db/queries/status', () => ({ upsertReadingStatus: vi.fn() }));
mock.module('../lib/ndl', () => ({ searchBooksFromNDL: vi.fn() }));
// --- End Mocks ---

// Helper to import mocked functions for typing and control
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getAuth } from '../lib/auth';
import { fetchBook, createBook } from '../db/queries/book';
import { upsertReadingStatus } from '../db/queries/status';
import { searchBooksFromNDL } from '../lib/ndl';

describe('Action: updateReadingStatus', () => {
  let mockDb: ReturnType<typeof createFreshTestDb>['db'];
  let mockSqlite: ReturnType<typeof createFreshTestDb>['sqlite'];

  const mockUser: User = {
    id: 'test-user-123',
    username: 'Test User',
    email: 'test@example.com',
    provider: null, isAdmin: false, description: null, image: null, lastLoginAt: null, createdAt: '', updatedAt: ''
  };

  const mockBookIdentifiersISBN: BookIdentifiers = { isbn: '9781234567890' };
  const mockBookIdentifiersNDL: BookIdentifiers = { ndlBibId: 'NDL12345' };
  const mockBookIdentifiersNone: BookIdentifiers = {};

  const mockBookDetailFromNDL: BookNDL = {
    title: 'Book from NDL', author: 'NDL Author', isbn: '9781234567890', ndlBibId: 'NDL12345',
    publisher: 'NDL Publisher', pubDate: '2023', seriesTitle: '', volume: '', itemCaption: '',
    contributor: '', creator: '', titleTranscription: '', creatorTranscription: '', subject: '',
    ndc: '', price: '', extent: '', description: '', isbn10: '', imageUrl: '',
  };

  // This should match the structure of BookSchemaType from your schema
  const mockBookInDb: BookSchemaType = {
    id: 'db-book-id-1',
    title: 'Book in DB',
    author: 'DB Author',
    isbn: '9780987654321',
    ndlBibId: 'NDLDB123',
    publisher: 'DB Publisher',
    publishedDate: '2022',
    coverImage: null,
    thumbnail: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const targetStatus: ReadingStatusType = 'read';
  const newReadingStatus: ReadingStatusType = 'read';

  beforeEach(() => {
    const { db, sqlite } = createFreshTestDb();
    mockDb = db;
    mockSqlite = sqlite;

    (getCloudflareContext as ReturnType<typeof vi.fn>).mockReturnValue({ env: { DB: mockDb } });

    const mockAuthInstance = { api: { getSession: vi.fn() } };
    (getAuth as ReturnType<typeof vi.fn>).mockReturnValue(mockAuthInstance);
  });

  afterEach(() => {
    mockSqlite.close();
    // vi.resetAllMocks(); // Replaced with clearAllMocks or individual resets
    vi.clearAllMocks();
    // If vi.clearAllMocks() is not available or doesn't work, reset mocks individually:
    // (getCloudflareContext as ReturnType<typeof vi.fn>).mockClear();
    // (getAuth as ReturnType<typeof vi.fn>).mockClear();
    // const authInstance = getAuth(null as any);
    // if (authInstance && authInstance.api && typeof authInstance.api.getSession.mockClear === 'function') {
    //   authInstance.api.getSession.mockClear();
    // }
    // (fetchBook as ReturnType<typeof vi.fn>).mockClear();
    // (createBook as ReturnType<typeof vi.fn>).mockClear();
    // (upsertReadingStatus as ReturnType<typeof vi.fn>).mockClear();
    // (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockClear();
  });

  // 1. Authentication - Unauthenticated
  describe('Authentication - Unauthenticated', () => {
    it('should return error if user is not logged in', async () => {
      const mockAuthApi = getAuth(mockDb).api;
      (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await updateReadingStatus(mockBookIdentifiersISBN, targetStatus);
      expect(result).toEqual({ error: 'この操作にはログインが必要です' });
    });
  });

  // Authenticated Scenarios
  describe('Authenticated User Scenarios', () => {
    beforeEach(() => {
      // For all subsequent tests, assume user is authenticated
      const mockAuthApi = getAuth(mockDb).api;
      (mockAuthApi.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, session: {} as any });
    });

    // 2. Book not in DB - NDL success, normal registration
    describe('Book not in DB - NDL success, normal registration', () => {
      it('should register book from NDL and update status', async () => {
        (fetchBook as ReturnType<typeof vi.fn>).mockResolvedValue(null); // Book not in DB
        (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockResolvedValue({ books: [mockBookDetailFromNDL], total: 1, url: '' });
        (createBook as ReturnType<typeof vi.fn>).mockResolvedValue(mockBookInDb); // Simulate DB insertion returns the new book
        (upsertReadingStatus as ReturnType<typeof vi.fn>).mockResolvedValue(newReadingStatus);

        const result = await updateReadingStatus(mockBookIdentifiersNDL, targetStatus);

        expect(fetchBook).toHaveBeenCalledWith(mockDb, mockBookIdentifiersNDL);
        expect(searchBooksFromNDL).toHaveBeenCalledWith({ count: 1, params: { any: mockBookIdentifiersNDL.ndlBibId } });
        expect(createBook).toHaveBeenCalledWith(mockDb, mockBookDetailFromNDL);
        expect(upsertReadingStatus).toHaveBeenCalledWith(mockDb, mockUser.id, mockBookInDb.id, targetStatus);
        expect(result).toEqual<UpdateReadingStatusResult>({ // UpdateReadingStatusResult is the type for the return
          book: {
            detail: mockBookInDb,
            readingStatus: newReadingStatus,
          },
        });
      });
    });

    // 3. Book not in DB - NDL failure
    describe('Book not in DB - NDL failure', () => {
      it('should return error if NDL search fails', async () => {
        (fetchBook as ReturnType<typeof vi.fn>).mockResolvedValue(null);
        (searchBooksFromNDL as ReturnType<typeof vi.fn>).mockResolvedValue({ books: [], total: 0, url: '' }); // NDL fails

        const result = await updateReadingStatus(mockBookIdentifiersISBN, targetStatus);

        expect(fetchBook).toHaveBeenCalledWith(mockDb, mockBookIdentifiersISBN);
        expect(searchBooksFromNDL).toHaveBeenCalledWith({ count: 1, params: { isbn: mockBookIdentifiersISBN.isbn } });
        expect(createBook).not.toHaveBeenCalled();
        expect(upsertReadingStatus).not.toHaveBeenCalled();
        expect(result).toEqual({ error: '対象の書籍データを取得できませんでした' });
      });
    });

    // 4. Book not in DB - Missing identifiers
    describe('Book not in DB - Missing identifiers', () => {
      it('should return error if no identifiers are provided', async () => {
        (fetchBook as ReturnType<typeof vi.fn>).mockResolvedValue(null);

        const result = await updateReadingStatus(mockBookIdentifiersNone, targetStatus);

        expect(fetchBook).toHaveBeenCalledWith(mockDb, mockBookIdentifiersNone);
        expect(searchBooksFromNDL).not.toHaveBeenCalled();
        expect(createBook).not.toHaveBeenCalled();
        expect(upsertReadingStatus).not.toHaveBeenCalled();
        expect(result).toEqual({ error: 'この書籍は未対応のため登録できません' });
      });
    });

    // 5. Book already in DB - Normal update
    describe('Book already in DB - Normal update', () => {
      it('should update status for existing book', async () => {
        (fetchBook as ReturnType<typeof vi.fn>).mockResolvedValue(mockBookInDb); // Book exists in DB
        (upsertReadingStatus as ReturnType<typeof vi.fn>).mockResolvedValue(newReadingStatus);

        const result = await updateReadingStatus({ id: mockBookInDb.id }, targetStatus); // Use existing book ID

        expect(fetchBook).toHaveBeenCalledWith(mockDb, { id: mockBookInDb.id });
        expect(searchBooksFromNDL).not.toHaveBeenCalled();
        expect(createBook).not.toHaveBeenCalled();
        expect(upsertReadingStatus).toHaveBeenCalledWith(mockDb, mockUser.id, mockBookInDb.id, targetStatus);
        expect(result).toEqual<UpdateReadingStatusResult>({
          book: {
            detail: mockBookInDb,
            readingStatus: newReadingStatus,
          },
        });
      });
    });
  });
});

