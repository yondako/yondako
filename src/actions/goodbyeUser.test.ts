import { describe, it, expect, vi, mock, beforeEach, afterEach } from 'bun:test';
import { goodbyeUser, type GoodByeUserResult } from './goodbyeUser'; // Adjusted import
import { createFreshTestDb } from '../db'; // Adjusted path for DB utils
import type { D1Database } from '@cloudflare/workers-types';

// --- Mocks ---
// Mock getCloudflareContext from @opennextjs/cloudflare
mock.module('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(),
}));

// Mock deleteUser from src/db/queries/user.ts
mock.module('../db/queries/user', () => ({
  deleteUser: vi.fn(),
}));
// --- End Mocks ---

// Helper to import mocked functions for typing and control
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { deleteUser } from '../db/queries/user'; // Adjusted path for DB queries

describe('Action: goodbyeUser', () => {
  let mockDb: D1Database; // Using D1Database type as per deleteUser signature
  let mockSqlite: ReturnType<typeof createFreshTestDb>['sqlite']; // To close the connection

  const previousState: GoodByeUserResult = { success: false }; // Initial state for the action

  beforeEach(() => {
    const { db: testDb, sqlite: testSqlite } = createFreshTestDb();
    // The `deleteUser` function expects a D1Database, but our test DB via `createFreshTestDb`
    // is a BetterSQLite3Database. For the purpose of this mock, we'll cast it.
    // In a real scenario, you'd ensure `deleteUser` can handle either or adapt the mock.
    mockDb = testDb as unknown as D1Database;
    mockSqlite = testSqlite;

    // Setup getCloudflareContext mock
    (getCloudflareContext as ReturnType<typeof vi.fn>).mockReturnValue({
      env: { DB: mockDb },
    });
  });

  afterEach(() => {
    mockSqlite.close(); // Close the in-memory database after each test
    // vi.resetAllMocks(); // Replaced with clearAllMocks or individual resets
    vi.clearAllMocks();
    // If vi.clearAllMocks() is not available or doesn't work, reset mocks individually:
    // (getCloudflareContext as ReturnType<typeof vi.fn>).mockClear();
    // (deleteUser as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('Normal case', () => {
    it('should call deleteUser and return { success: true } when phrase is correct and deleteUser succeeds', async () => {
      const formData = new FormData();
      formData.append('phrase', 'アカウントを削除');

      // Mock deleteUser to simulate success (returns undefined or no string)
      (deleteUser as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const result = await goodbyeUser(previousState, formData);

      expect(getCloudflareContext).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledWith(mockDb);
      expect(result).toEqual({ success: true });
    });
  });

  describe('Abnormal case - Phrase mismatch', () => {
    it('should not call deleteUser and return error when phrase is incorrect', async () => {
      const formData = new FormData();
      formData.append('phrase', '間違ったフレーズ');

      const result = await goodbyeUser(previousState, formData);

      expect(getCloudflareContext).not.toHaveBeenCalled(); // Not called because phrase check fails first
      expect(deleteUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: '入力された文章が違います。正しく入力してください',
      });
    });

    it('should not call deleteUser and return error when phrase is missing', async () => {
      const formData = new FormData();
      // No phrase appended

      const result = await goodbyeUser(previousState, formData);

      expect(getCloudflareContext).not.toHaveBeenCalled();
      expect(deleteUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: '入力された文章が違います。正しく入力してください',
      });
    });
  });

  describe('Abnormal case - Database error', () => {
    it('should call deleteUser and return error when deleteUser returns an error message', async () => {
      const formData = new FormData();
      formData.append('phrase', 'アカウントを削除');

      const dbErrorMessage = 'Database connection failed';
      // Mock deleteUser to simulate a database error (returns an error string)
      (deleteUser as ReturnType<typeof vi.fn>).mockResolvedValue(dbErrorMessage);

      const result = await goodbyeUser(previousState, formData);

      expect(getCloudflareContext).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledWith(mockDb);
      expect(result).toEqual({
        success: false,
        error: dbErrorMessage,
      });
    });
  });
});
