import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * 書籍情報
 */
export const books = sqliteTable("books", {
  ndlBibId: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  link: text("link").notNull(),
  isbn: text("isbn"),
  jpNo: text("jpNo"),
  thumbnailUrl: text("thumbnailUrl"),
});

export const booksRelations = relations(books, ({ many }) => ({
  bookAuthors: many(bookAuthors),
  bookPublishers: many(bookPublishers),
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
export const bookAuthors = sqliteTable("book_authors", {
  bookId: text("book_id").references(() => books.ndlBibId, {
    onDelete: "cascade",
  }),
  authorId: integer("author_id").references(() => authors.id, {
    onDelete: "cascade",
  }),
});

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
  book: one(books, {
    fields: [bookAuthors.bookId],
    references: [books.ndlBibId],
  }),
  author: one(authors, {
    fields: [bookAuthors.authorId],
    references: [authors.id],
  }),
}));

/**
 * 書籍と出版社
 */
export const bookPublishers = sqliteTable("book_publishers", {
  bookId: text("book_id").references(() => books.ndlBibId, {
    onDelete: "cascade",
  }),
  publisherId: integer("publisher_id").references(() => publishers.id, {
    onDelete: "cascade",
  }),
});

export const bookPublishersRelations = relations(bookPublishers, ({ one }) => ({
  book: one(books, {
    fields: [bookPublishers.bookId],
    references: [books.ndlBibId],
  }),
  publisher: one(publishers, {
    fields: [bookPublishers.publisherId],
    references: [publishers.id],
  }),
}));
