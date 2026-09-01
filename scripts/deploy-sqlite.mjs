import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL;
if (!url?.startsWith("file:")) throw new Error("SQLite DATABASE_URL must start with file:");
const databasePath = path.resolve(process.cwd(), url.slice("file:".length));
const migrationsRoot = path.resolve(process.cwd(), "prisma", "migrations");
const migrationNames = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const database = new Database(databasePath);

try {
  database.pragma("foreign_keys = ON");
  database.exec("CREATE TABLE IF NOT EXISTS _pocket_ledger_migrations (name TEXT NOT NULL PRIMARY KEY, appliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  let appliedCount = 0;
  for (const migrationName of migrationNames) {
    const applied = database.prepare("SELECT name FROM _pocket_ledger_migrations WHERE name = ?").get(migrationName);
    if (applied) continue;
    const migrationPath = path.resolve(migrationsRoot, migrationName, "migration.sql");
    const migrate = database.transaction(() => {
      database.exec(readFileSync(migrationPath, "utf8"));
      database.prepare("INSERT INTO _pocket_ledger_migrations (name) VALUES (?)").run(migrationName);
    });
    migrate();
    appliedCount += 1;
    console.log(`Applied SQLite migration ${migrationName}`);
  }
  if (!appliedCount) console.log("SQLite database is up to date");
} finally {
  database.close();
}
