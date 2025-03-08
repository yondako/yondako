PRAGMA foreign_keys = OFF;

-- verification テーブルの作成
CREATE TABLE `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expiresAt` text NOT NULL,
  `createdAt` text,
  `updatedAt` text
);

-- verificationToken テーブルの削除
DROP TABLE `verificationToken`;

-- 1. account テーブルを一時テーブルに退避（外部キー制約なし）
CREATE TABLE __temp_account (
  id TEXT PRIMARY KEY NOT NULL,
  accountId TEXT DEFAULT '' NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TEXT,
  refreshTokenExpiresAt TEXT,
  scope TEXT,
  password TEXT,
  createdAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  updatedAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

INSERT INTO
  __temp_account (
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
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM
  account;

-- 1. readingStatuses テーブルを一時テーブルに退避（外部キー制約なし）
CREATE TABLE __temp_readingStatuses (
  userId TEXT NOT NULL,
  bookId TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updatedAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (userId, bookId)
);

INSERT INTO
  __temp_readingStatuses (
    userId,
    bookId,
    status,
    createdAt,
    updatedAt
  )
SELECT
  userId,
  bookId,
  status,
  createdAt,
  updatedAt
FROM
  readingStatuses;

-- 元のテーブルを削除
DROP TABLE account;
DROP TABLE readingStatuses;

-- 2. user テーブルの移行
CREATE TABLE __new_user (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  emailVerified INTEGER,
  image TEXT,
  createdAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  updatedAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

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

DROP TABLE user;
ALTER TABLE __new_user RENAME TO user;

-- 3. account テーブルに外部キー制約を付けて再作成
CREATE TABLE account (
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
  createdAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  updatedAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

-- 一時テーブルからデータを移行
INSERT INTO account SELECT * FROM __temp_account;
DROP TABLE __temp_account;

-- 3. readingStatuses テーブルに外部キー制約を付けて再作成
CREATE TABLE readingStatuses (
  userId TEXT NOT NULL,
  bookId TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updatedAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (userId, bookId),
  FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books (id) ON DELETE CASCADE
);

-- 一時テーブルからデータを移行
INSERT INTO readingStatuses SELECT * FROM __temp_readingStatuses;
DROP TABLE __temp_readingStatuses;

-- 4. session テーブルの移行（通常の移行）
CREATE TABLE __new_session (
  id TEXT PRIMARY KEY NOT NULL,
  expiresAt INTEGER NOT NULL,
  token TEXT,
  createdAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  updatedAt TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

DROP TABLE session;
ALTER TABLE __new_session RENAME TO session;

PRAGMA foreign_keys = ON;
