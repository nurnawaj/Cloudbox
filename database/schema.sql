-- Run this once on your Neon database (PostgreSQL).
-- PostgreSQL stores users and a record for each file.
-- The photos and PDFs themselves are on Cloudinary.

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,          -- bcrypt hash, never the real password
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,          -- original name, e.g. resume.pdf
  mime_type     VARCHAR(100) NOT NULL,
  size          INTEGER NOT NULL,               -- bytes
  url           VARCHAR(500) NOT NULL,          -- Cloudinary link
  public_id     VARCHAR(255) NOT NULL,          -- Cloudinary id, needed to delete
  resource_type VARCHAR(20)  NOT NULL DEFAULT 'image',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
