import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'contacts.db')

let db: Database.Database | null = null

// Get or Create DB
export function getDb(): Database.Database {
  if (db) return db

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      name                   TEXT NOT NULL,
      phone                  TEXT DEFAULT '',
      email                  TEXT DEFAULT '',
      picture                TEXT,
      is_favorite            INTEGER DEFAULT 0,
      is_muted               INTEGER DEFAULT 0,
      call_handling_enabled  INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS media_library (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      url        TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)

  return db
}
