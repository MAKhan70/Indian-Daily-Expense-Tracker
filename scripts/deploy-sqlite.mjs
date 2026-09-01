import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL;
if (!url?.startsWith("file:")) throw new Error("SQLite DATABASE_URL must start with file:");
const databasePath = path.resolve(process.cwd(), url.slice("file:".length));
const migrationName = "20260901150000_init";
const migrationPath = path.resolve(process.cwd(), "prisma", "migrations", migrationName, "migration.sql");
const database = new Database(databasePath);

try {
  database.pragma("foreign_keys = ON");
  database.exec("CREATE TABLE IF NOT EXISTS _pocket_ledger_migrations (name TEXT NOT NULL PRIMARY KEY, appliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  const applied = database.prepare("SELECT name FROM _pocket_ledger_migrations WHERE name = ?").get(migrationName);
  if (!applied) {
    const migrate = database.transaction(() => {
      database.exec(readFileSync(migrationPath, "utf8"));
      database.prepare("INSERT INTO _pocket_ledger_migrations (name) VALUES (?)").run(migrationName);
    });
    migrate();
    console.log(`Applied SQLite migration ${migrationName}`);
  } else {
    console.log("SQLite database is up to date");
  }
} finally {
  database.close();
}
