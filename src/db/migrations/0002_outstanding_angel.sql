ALTER TABLE `books` ADD `ndlBibId` text;--> statement-breakpoint
CREATE UNIQUE INDEX `books_ndlBibId_unique` ON `books` (`ndlBibId`);
UPDATE books SET ndlBibId = id;
