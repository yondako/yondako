PRAGMA foreign_keys = OFF;

-- account テーブルの再作成
CREATE TABLE __new_account (
  id TEXT PRIMARY KEY NOT NULL,
  providerAccountId TEXT DEFAULT '' NOT NULL,
  provider TEXT NOT NULL,
  userId TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

-- idは無いので生成する
INSERT INTO __new_account (
  id, providerAccountId, provider, userId, access_token, refresh_token, id_token, expires_at, refresh_token_expires_at, scope, password, created_at, updated_at
)
SELECT 
  lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' ||
        substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
  providerAccountId, provider, userId, access_token, refresh_token, id_token, expires_at, refresh_token_expires_at, scope, password,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM account;

DROP TABLE account;
ALTER TABLE __new_account RENAME TO account;

-- session テーブルの再作成
CREATE TABLE __new_session (
  id TEXT PRIMARY KEY NOT NULL,
  expires INTEGER NOT NULL,
  sessionToken TEXT,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

-- session テーブルのデータ移行（id は新たに生成）
INSERT INTO __new_session (
  id, expires, sessionToken, created_at, updated_at, ip_address, user_agent, userId
)
SELECT 
  lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' ||
        substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
  expires, sessionToken, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ip_address, user_agent, userId
FROM session;

DROP TABLE session;
ALTER TABLE __new_session RENAME TO session;

-- user テーブルの再作成（created_at, updated_at を追加）
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

PRAGMA foreign_keys = ON;
