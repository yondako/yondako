import { eq } from "drizzle-orm";
// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { getDB } from "./src/db";
import { books } from "./src/db/schema/book";
import { fetchThumbnailUrl } from "./src/lib/thumbnail/rakuten";

const MAX_RETRY_ATTEMPTS = 3;

export default {
  fetch: handler.fetch,

  async queue(batch: MessageBatch<ThumbnailJobMessage>, env: CloudflareEnv): Promise<void> {
    const db = getDB(env.DB);

    for (const message of batch.messages) {
      const { bookId, isbn } = message.body;

      try {
        const thumbnailUrl = await fetchThumbnailUrl(
          isbn,
          env.RAKUTEN_APP_ID,
          env.RAKUTEN_APP_SECRET,
          env.BETTER_AUTH_URL,
        );

        if (thumbnailUrl) {
          await db.update(books).set({ thumbnailUrl }).where(eq(books.id, bookId));
        }

        message.ack();
      } catch (error) {
        console.error(`Failed to fetch thumbnail for ${isbn}:`, error);

        if (message.attempts >= MAX_RETRY_ATTEMPTS) {
          console.error(`Max retries exceeded for ${isbn}`);
          message.ack();
        } else {
          message.retry();
        }
      }

      // Rakuten APIレート制限対応（1秒に1リクエスト）
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },
} satisfies ExportedHandler<CloudflareEnv, ThumbnailJobMessage>;
