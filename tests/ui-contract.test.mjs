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
  assert.match(appSource, /className="menu-theme-toggle"/);
  assert.match(appSource, /id="mobile-profile-photo"/);
  const mobileNav = appSource.slice(appSource.indexOf("function MobileNav"), appSource.indexOf("function Header"));
  assert.doesNotMatch(mobileNav, /mobile-add|Add expense/);
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
  assert.match(drawer, />Classify the Spending</);
  assert.match(drawer, />Add the Expense Details</);
  assert.doesNotMatch(drawer, /className="form-step"><span>[12]<\/span>/);
  assert.match(drawer, /className="quick-amounts"/);
  assert.match(drawer, /QUICK_AMOUNTS\[form\.frequency\]/);
});

test("dashboard greeting uses the account name and IST while settings expose appearance controls", () => {
  const header = appSource.slice(appSource.indexOf("function Header"), appSource.indexOf("function MobileMenuDrawer"));
  assert.match(header, /indiaGreeting\(now\)/);
  assert.match(header, /user\?\.name/);
  assert.match(header, /· IST/);
  const settings = appSource.slice(appSource.indexOf("function SettingsView"), appSource.indexOf("function AddExpenseDrawer"));
  assert.match(settings, />Appearance</);
  assert.match(settings, />Colour palette</);
  assert.match(settings, />Look</);
  assert.match(settings, /\["system", "Device"\]/);
});

test("category studio supports custom, enabled and ordered categories across frequencies", () => {
  const categories = appSource.slice(appSource.indexOf("function CategoriesView"), appSource.indexOf("function ReportsView"));
  assert.match(categories, /Add your own category/);
  assert.match(categories, /Add a sub-category/);
  assert.match(categories, /aria-label={`Move \$\{group\.name\} up`}/);
  assert.match(categories, /aria-pressed={group\.enabled}/);
  assert.match(categories, /past transactions/);
  assert.match(categories, /className="custom-badge">Custom/);
  assert.match(categories, /Edit category name/);
  assert.match(categories, /Delete custom item/);
  const drawer = appSource.slice(appSource.indexOf("function AddExpenseDrawer"), appSource.indexOf("export default function App"));
  assert.match(drawer, /activeCategoryGroups\(categoryConfig, form\.frequency\)/);
});

test("analytics exposes selectable chart modules and private AI analysis", () => {
  const reports = appSource.slice(appSource.indexOf("function ReportsView"), appSource.indexOf("function SettingsView"));
  assert.match(reports, /Choose chart modules/);
  assert.match(reports, /modules\.pie/);
  assert.match(reports, /modules\.bar/);
  assert.match(reports, /modules\.trend/);
  assert.match(reports, />AI Analysis</);
  assert.match(reports, /nothing is sent outside Pocket Ledger/);
  assert.match(reports, /id="pie-parameter"/);
  assert.match(reports, /id="bar-parameter"/);
  assert.match(reports, /id="trend-parameter"/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.skip-link:focus/);
});

test("expense entry uses the modern calendar and settings expose twenty palettes", () => {
  const datePicker = appSource.slice(appSource.indexOf("function ModernDatePicker"), appSource.indexOf("function AddExpenseDrawer"));
  assert.match(datePicker, /date-popover/);
  assert.match(datePicker, />Today</);
  assert.match(datePicker, />Yesterday</);
  const drawer = appSource.slice(appSource.indexOf("function AddExpenseDrawer"), appSource.indexOf("function LedgerApp"));
  assert.doesNotMatch(drawer, /type="date"/);
  const settings = appSource.slice(appSource.indexOf("function SettingsView"), appSource.indexOf("function ModernDatePicker"));
  assert.equal((settings.match(/\["[a-z-]+", "[^"]+"\]/g) || []).length, 23);
  assert.match(settings, /Calm Indigo/);
});

test("transactions show dates below amounts and edits use a confirmation popup", () => {
  const row = appSource.slice(appSource.indexOf("function TransactionRow"), appSource.indexOf("function TransactionList"));
  assert.match(row, /className="transaction-amount-cell"/);
  assert.ok(row.indexOf("transaction-amount") < row.indexOf("{dateLabel}"));
  const drawer = appSource.slice(appSource.indexOf("function ExpenseActionDialog"), appSource.indexOf("function LedgerApp"));
  assert.match(drawer, /role="alertdialog"/);
  assert.match(drawer, /Confirm expense update/);
  assert.match(drawer, /Delete and archive/);
  assert.doesNotMatch(drawer, /Before saving, acknowledge all 3 notices/);
  assert.doesNotMatch(drawer, /edit-notice-/);
});

test("monthly grocery list is standalone, month-aware and analytically visible", () => {
  assert.match(appSource, /id: "groceries", label: "Monthly Grocery List"/);
  const grocery = appSource.slice(appSource.indexOf("function GroceryListView"), appSource.indexOf("function AccountCard"));
  assert.match(grocery, /Add a grocery item/);
  assert.match(grocery, /grocery-quantity/);
  assert.match(grocery, /grocery-unit-price/);
  assert.match(grocery, /Custom segregation/);
  assert.match(grocery, /Included this month/);
  assert.match(grocery, /Skipped this month/);
  assert.match(grocery, /Copy \{monthLabel\(previousMonth\)\}/);
  assert.match(grocery, /never enter spending or budget totals/);
  assert.match(styles, /\.grocery-page/);
  assert.match(styles, /\.grocery-analytics-card/);
});
