import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const server = await readFile(new URL("server/index.ts", root), "utf8");
const schema = await readFile(new URL("prisma/schema.prisma", root), "utf8");
const auth = await readFile(new URL("server/auth.ts", root), "utf8");

test("protects every ledger state endpoint with an authenticated session", () => {
  for (const route of ["/api/state\"", "/api/state/import", "/api/state/start-fresh"]) {
    const line = server.split("\n").find((candidate) => candidate.includes(route));
    assert.match(line || "", /requireSession/);
  }
  assert.match(server, /auth\.api\.getSession/);
});

test("scopes finance records to a user and cascades account deletion", () => {
  for (const model of ["Expense", "ExpenseArchive", "MonthlyBudget", "PaymentAccount", "UserPreference"]) {
    const block = schema.slice(schema.indexOf(`model ${model}`), schema.indexOf("\n}", schema.indexOf(`model ${model}`)));
    assert.match(block, /userId\s+String/);
    assert.match(block, /onDelete: Cascade/);
  }
});

test("persists account appearance preferences", () => {
  const preference = schema.slice(schema.indexOf("model UserPreference"), schema.indexOf("\n}", schema.indexOf("model UserPreference")));
  assert.match(preference, /themeMode\s+String/);
  assert.match(preference, /palette\s+String/);
  assert.match(preference, /look\s+String/);
});

test("persists category management and analytics module preferences", () => {
  const preference = schema.slice(schema.indexOf("model UserPreference"), schema.indexOf("\n}", schema.indexOf("model UserPreference")));
  assert.match(preference, /categoryConfigJson\s+String/);
  assert.match(preference, /analyticsModulesJson\s+String/);
});

test("uses strong password limits, database rate limiting and secure production cookies", () => {
  assert.match(auth, /minPasswordLength:\s*12/);
  assert.match(auth, /storage:\s*"database"/);
  assert.match(auth, /useSecureCookies:\s*process\.env\.NODE_ENV === "production"/);
});
