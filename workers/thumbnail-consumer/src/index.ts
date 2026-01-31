import { fetchThumbnailUrl } from "./libs/rakuten";

const MAX_RETRY_ATTEMPTS = 3;

type Env = {
  DB: D1Database;
  RAKUTEN_APP_ID: string;
};

type ThumbnailJobMessage = {
  bookId: string;
  isbn: string;
};

export default {
  async queue(batch: MessageBatch<ThumbnailJobMessage>, env: Env): Promise<void> {
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
};
