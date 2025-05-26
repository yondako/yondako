import { vi } from 'bun:test';
import { createTestDb } from './db'; // Assuming db.ts is in the same directory
import type { AppLoadContext } from '@remix-run/cloudflare';
import type { Auth } from 'lucia';
import type { User } from '../db/schema/user'; // Adjust path as needed

// Mock for getCloudflareContext
export function mockCloudflareContext() {
  const { db: testDb } from createTestDb();

  const mockContext = {
    cloudflare: {
      env: {
        DB: testDb, // D1Database binding, now using our test DB
        // Add other necessary env variables if your actions use them
        // e.g., KV_NAMESPACE: new MockKVNamespace(),
      },
      // Add other Cloudflare specific context if needed
    },
  } as unknown as AppLoadContext; // Cast to avoid type errors if AppLoadContext is complex

  vi.mock('@opennextjs/cloudflare', async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
      ...originalModule,
      getCloudflareContext: vi.fn(() => mockContext),
    };
  });

  return mockContext;
}

// Mock for getAuth and api.getSession
interface MockAuthOptions {
  user?: User | null; // Allow specific user or null for unauthenticated
  error?: Error | null; // Simulate errors during session retrieval
}

export function mockGetAuth(options: MockAuthOptions = {}) {
  const { user = null, error = null } = options;

  const mockAuthObject = {
    api: {
      getSession: vi.fn(async () => {
        if (error) {
          throw error;
        }
        if (user) {
          return { user, session: { userId: user.id, expiresAt: new Date(Date.now() + 3600 * 1000) } }; // Mock session object
        }
        return null; // No user, unauthenticated
      }),
    },
    // Add other Auth object properties/methods if your actions use them
  } as unknown as Auth; // Cast to avoid type errors if Auth is complex

  vi.mock('../lib/auth', async (importOriginal) => { // Adjust path to your auth.ts
    const originalModule = await importOriginal();
    return {
      ...originalModule,
      getAuth: vi.fn(() => mockAuthObject),
    };
  });

  return mockAuthObject;
}

// Example of a mock KV Namespace if needed
// class MockKVNamespace {
//   private store = new Map<string, any>();
//   async get(key: string) {
//     return this.store.get(key) || null;
//   }
//   async put(key: string, value: any) {
//     this.store.set(key, value);
//   }
//   async delete(key: string) {
//     this.store.delete(key);
//   }
//   async list(options?: KVNamespaceListOptions) {
//     // Simplified list, actual implementation might need more details
//     const keys = Array.from(this.store.keys()).map(name => ({ name }));
//     return { keys, list_complete: true, cursor: undefined };
//   }
// }

// Call these functions in your test setup (e.g., beforeEach)
// to apply the mocks before each test case.
// Example:
//
// import { beforeEach } from 'bun:test';
// import { mockCloudflareContext, mockGetAuth } from './mocks';
//
// beforeEach(() => {
//   mockCloudflareContext();
//   mockGetAuth({ user: { id: 'test-user-id', email: 'test@example.com', ... } }); // Or simply mockGetAuth() for unauthenticated
// });
