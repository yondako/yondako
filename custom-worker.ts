// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { fetchThumbnailUrl } from "./src/lib/thumbnail/rakuten";

const MAX_RETRY_ATTEMPTS = 3;

export default {
  fetch: handler.fetch,

  async queue(batch: MessageBatch<ThumbnailJobMessage>, env: CloudflareEnv): Promise<void> {
    for (const message of batch.messages) {
      const { bookId, isbn } = message.body;

      try {
        const thumbnailUrl = await fetchThumbnailUrl(isbn, env.RAKUTEN_APP_ID);

        if (thumbnailUrl) {
          await env.DB.prepare("UPDATE books SET thumbnail_url = ? WHERE id = ?").bind(thumbnailUrl, bookId).run();
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
