import Database, { type Database as DatabaseType } from "better-sqlite3";

const db: DatabaseType = new Database("database.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    ticketType TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    eventDate TEXT NOT NULL,
    session TEXT NOT NULL,
    terms INTEGER NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_birthday TEXT NOT NULL,
    user_pass TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
