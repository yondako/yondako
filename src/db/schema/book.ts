import { readingStatusValues } from "@/types/readingStatus";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./user";

/**
 * 書籍データ
 */
export const books = sqliteTable("books", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  link: text("link").notNull(),
  ndlBibId: text("ndlBibId").unique(),
  isbn: text("isbn"),
  jpNo: text("jpNo"),
  jpeCode: text("jpeCode"),
});

export const booksRelations = relations(books, ({ many }) => ({
  bookAuthors: many(bookAuthors),
  bookPublishers: many(bookPublishers),
  readingStatuses: many(readingStatuses),
}));

/**
 * 著者情報
 */
export const authors = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  bookAuthors: many(bookAuthors),
}));

/**
 * 出版社情報
 */
export const publishers = sqliteTable("publishers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export const publishersRelations = relations(publishers, ({ many }) => ({
  bookPublishers: many(bookPublishers),
}));

/**
 * 書籍と著者
 */
export const bookAuthors = sqliteTable("bookAuthors", {
  bookId: text("bookId").references(() => books.id, {
    onDelete: "cascade",
  }),
  authorId: integer("authorId").references(() => authors.id, {
    onDelete: "cascade",
  }),
});

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
  book: one(books, {
    fields: [bookAuthors.bookId],
    references: [books.id],
  }),
  author: one(authors, {
    fields: [bookAuthors.authorId],
    references: [authors.id],
  }),
}));

/**
 * 書籍と出版社
 */
export const bookPublishers = sqliteTable("bookPublishers", {
  bookId: text("bookId").references(() => books.id, {
    onDelete: "cascade",
  }),
  publisherId: integer("publisherId").references(() => publishers.id, {
    onDelete: "cascade",
  }),
});

export const bookPublishersRelations = relations(bookPublishers, ({ one }) => ({
  book: one(books, {
    fields: [bookPublishers.bookId],
    references: [books.id],
  }),
  publisher: one(publishers, {
    fields: [bookPublishers.publisherId],
    references: [publishers.id],
  }),
}));

/**
 * 読書ステータス
 */
export const readingStatuses = sqliteTable(
  "readingStatuses",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    bookId: text("bookId")
      .notNull()
      .references(() => books.id, {
        onDelete: "cascade",
      }),
    status: text("status", {
      enum: readingStatusValues,
    }).notNull(),
    createdAt: text("createdAt").notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updatedAt")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
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
      references: [books.id],
    }),
  }),
);
