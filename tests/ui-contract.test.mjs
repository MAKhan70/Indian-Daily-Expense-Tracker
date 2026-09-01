import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

test("dashboard keeps month navigation inside the budget tile and spending mix beside it", () => {
  const dashboard = appSource.slice(appSource.indexOf("function Dashboard"), appSource.indexOf("function TransactionsView"));
  assert.ok(dashboard.indexOf("<BudgetHero") < dashboard.indexOf("<SpendingMix"));
  const budgetHero = appSource.slice(appSource.indexOf("function BudgetHero"), appSource.indexOf("function SpendingMix"));
  assert.match(budgetHero, /<MonthNavigator[^>]+Dashboard budget month/);
  assert.match(styles, /\.dashboard-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.35fr\)\s+minmax\(320px,\s*\.75fr\)/s);
});

test("mobile navigation is a top-left drawer rather than a centered sheet", () => {
  assert.match(appSource, /className="mobile-menu-drawer"[^>]+role="dialog"[^>]+aria-modal="true"/);
  assert.match(styles, /\.mobile-menu-panel\s*\{[^}]*inset:\s*0 auto 0 0;/s);
  assert.match(styles, /@keyframes menu-slide-in/);
});

test("expense entry follows the requested classification and amount order", () => {
  const drawer = appSource.slice(appSource.indexOf("function AddExpenseDrawer"), appSource.indexOf("export default function App"));
  const labels = [
    "expense-category-group",
    "expense-category",
    "expense-amount",
    "expense-name",
    "expense-date",
    "expense-payment",
  ];
  const positions = labels.map((label) => drawer.indexOf(`htmlFor="${label}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(drawer, /Expense name <small>Optional<\/small>/);
});
