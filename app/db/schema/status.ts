import { readingStatusValues } from "@/types/book";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { books } from "./book";
import { users } from "./user";

/**
 * 読書ステータス
 */
export const readingStatuses = sqliteTable(
  "reading_statuses",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    bookId: text("bookId")
      .notNull()
      .references(() => books.ndlBibId),
    status: text("status", {
      enum: readingStatusValues,
    }).notNull(),
    createdAt: text("createdAt").notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updatedAt").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    userBook: primaryKey({
      columns: [t.userId, t.bookId],
    }),
  }),
);

export const readingStatusesRelations = relations(
  readingStatuses,
  ({ one }) => ({
    user: one(users, {
      fields: [readingStatuses.userId],
      references: [users.id],
    }),
    book: one(books, {
      fields: [readingStatuses.bookId],
      references: [books.ndlBibId],
    }),
  }),
);
