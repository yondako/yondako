import { bookStatusValues } from "@/types/book";
import { sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { books } from "./book";
import { users } from "./user";

/**
 * 読書ステータス
 */
export const readingStatuses = sqliteTable(
  "reading_statuses",
  {
    userId: text("userId")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    bookId: text("book_id")
      .references(() => books.ndlBibId)
      .notNull(),
    status: text("status", { enum: bookStatusValues }).notNull(),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  },
  (t) => ({
    userBook: unique("user_book").on(t.userId, t.bookId),
  }),
);
