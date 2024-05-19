import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

export const authors = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  bookAuthors: many(bookAuthors),
}));

export const publishers = sqliteTable("publishers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export const publishersRelations = relations(publishers, ({ many }) => ({
  bookPublishers: many(bookPublishers),
}));

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
