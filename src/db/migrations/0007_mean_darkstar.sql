ALTER TABLE `account` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `token_type` text;--> statement-breakpoint
ALTER TABLE `account` ADD `session_state` text;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `account_id`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `provider_id`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `refresh_token_expires_at`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `updated_at`;
