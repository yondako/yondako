CREATE TABLE `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expiresAt` integer NOT NULL,
  `createdAt` integer,
  `updatedAt` integer
);
-- --> statement-breakpoint
DROP TABLE `verificationToken`;--> statement-breakpoint
PRAGMA foreign_keys = OFF;--> statement-breakpoint
CREATE TABLE __new_account (
  id TEXT PRIMARY KEY NOT NULL,
  accountId TEXT DEFAULT '' NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  password TEXT,
  createdAt INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL,
  updatedAt INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO
  __new_account (
    id,
    accountId,
    providerId,
    userId,
    accessToken,
    refreshToken,
    idToken,
    accessTokenExpiresAt,
    scope,
    createdAt,
    updatedAt
  )
SELECT
  lower(
    hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))
  ),
  providerAccountId,
  provider,
  userId,
  access_token,
  refresh_token,
  id_token,
  expires_at,
  scope,
  (CAST(strftime('%s', 'now') AS INTEGER)),
  (CAST(strftime('%s', 'now') AS INTEGER))
FROM
  account;
--> statement-breakpoint
DROP TABLE account;--> statement-breakpoint
ALTER TABLE __new_account RENAME TO account;--> statement-breakpoint
CREATE TABLE __new_session (
  id TEXT PRIMARY KEY NOT NULL,
  expiresAt INTEGER NOT NULL,
  token TEXT,
  createdAt INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL,
  updatedAt INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE
);
--> statement-breakpoint
DROP TABLE session;--> statement-breakpoint
ALTER TABLE __new_session RENAME TO session;--> statement-breakpoint
CREATE TABLE __new_user (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  emailVerified INTEGER,
  image TEXT,
  created_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL,
  updated_at INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)) NOT NULL
);
--> statement-breakpoint
INSERT INTO
  __new_user (id, name, email, emailVerified, image)
SELECT
  id,
  name,
  email,
  emailVerified,
  image
FROM
  user;
--> statement-breakpoint
DROP TABLE user;--> statement-breakpoint
ALTER TABLE __new_user RENAME TO user;--> statement-breakpoint
PRAGMA foreign_keys = ON;--> statement-breakpoint
