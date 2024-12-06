PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_readingStatuses` (
	`userId` text NOT NULL,
	`bookId` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`userId`, `bookId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_readingStatuses`("userId", "bookId", "status", "createdAt", "updatedAt") SELECT "userId", "bookId", "status", "createdAt", "updatedAt" FROM `readingStatuses`;--> statement-breakpoint
DROP TABLE `readingStatuses`;--> statement-breakpoint
ALTER TABLE `__new_readingStatuses` RENAME TO `readingStatuses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;