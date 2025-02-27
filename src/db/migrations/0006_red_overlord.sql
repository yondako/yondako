PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`providerAccountId` text DEFAULT '' NOT NULL,
	`provider` text NOT NULL,
	`userId` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
-- idカラム用にUUIDを生成するように修正したINSERT文 (Claudeありがと)
INSERT INTO `__new_account`(`id`, `providerAccountId`, `provider`, `userId`, `access_token`, `refresh_token`, `id_token`, `expires_at`, `scope`, `created_at`, `updated_at`) 
SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))), 
       `providerAccountId`, `provider`, `userId`, `access_token`, `refresh_token`, `id_token`, `expires_at`, `scope`,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP 
FROM `account`;
--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL,
	`sessionToken` text,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires", "sessionToken", "created_at", "updated_at", "ip_address", "user_agent", "userId") SELECT "id", "expires", "sessionToken", "created_at", "updated_at", "ip_address", "user_agent", "userId" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
-- user テーブルの再作成 (ChatGPTありがと)
CREATE TABLE __new_user (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  emailVerified INTEGER,
  image TEXT,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO __new_user (id, name, email, emailVerified, image)
SELECT id, name, email, emailVerified, image
FROM user;
DROP TABLE user;
ALTER TABLE __new_user RENAME TO user;
PRAGMA foreign_keys=ON;--> statement-breakpoint
