CREATE INDEX `bookAuthors_bookId_idx` ON `bookAuthors` (`bookId`);--> statement-breakpoint
CREATE INDEX `bookPublishers_bookId_idx` ON `bookPublishers` (`bookId`);--> statement-breakpoint
CREATE INDEX `session_token_idx` ON `session` (`token`);