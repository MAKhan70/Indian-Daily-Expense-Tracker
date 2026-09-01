import assert from "node:assert/strict";
import test from "node:test";
import {
  CATEGORY_LIBRARY,
  CATEGORY_GROUPS,
  DEFAULT_ADVANCES,
  DEFAULT_CREDITS,
  PAYMENT_GROUPS,
  SEED_EXPENSES,
  createDefaultState,
  deleteExpenseWithArchive,
  isBudgetExpense,
  indiaDateKey,
  ledgerUsageForMonth,
  expensesForMonth,
  getBudgetForMonth,
  indiaGreeting,
  monthLabel,
  QUICK_AMOUNTS,
  shiftMonthKey,
  withBudgetForMonth,
  isPlannedExpense,
  upsertExpenseWithArchive,
} from "../src/domain.js";

test("provides broad category libraries for every expense frequency", () => {
  assert.deepEqual(Object.keys(CATEGORY_LIBRARY), ["daily", "weekly", "monthly", "one-off"]);
  for (const categories of Object.values(CATEGORY_LIBRARY)) {
    assert.ok(categories.length >= 80);
    assert.equal(new Set(categories).size, categories.length);
  }
  for (const frequency of Object.keys(CATEGORY_LIBRARY)) {
    assert.ok(CATEGORY_GROUPS[frequency].length >= 10);
    assert.deepEqual([...new Set(CATEGORY_GROUPS[frequency].flatMap((group) => group.subcategories))].sort(), [...CATEGORY_LIBRARY[frequency]].sort());
  }
});

test("archives the complete previous value before an edit or deletion", () => {
  const original = { id: "expense-1", name: "Original", amount: 100, date: "2026-08-20" };
  const base = { expenses: [original], archivedExpenses: [] };
  const edited = upsertExpenseWithArchive(base, { ...original, name: "Revised", amount: 125 }, "2026-08-31T10:00:00.000Z", "archive-edit");

  assert.equal(edited.expenses[0].name, "Revised");
  assert.deepEqual(edited.archivedExpenses[0], { ...original, archiveId: "archive-edit", archivedAt: "2026-08-31T10:00:00.000Z", archiveReason: "Edited" });

  const deleted = deleteExpenseWithArchive(edited, "expense-1", "2026-08-31T11:00:00.000Z", "archive-delete");
  assert.equal(deleted.expenses.length, 0);
  assert.equal(deleted.archivedExpenses[0].archiveReason, "Deleted");
  assert.equal(deleted.archivedExpenses[0].name, "Revised");
  assert.equal(deleted.archivedExpenses[1].name, "Original");
});

test("provides five configurable advance and five credit payment methods", () => {
  assert.equal(DEFAULT_ADVANCES.length, 5);
  assert.equal(DEFAULT_CREDITS.length, 5);
  assert.deepEqual(DEFAULT_ADVANCES.map(({ id }) => id), ["advance-1", "advance-2", "advance-3", "advance-4", "advance-5"]);
  assert.deepEqual(DEFAULT_CREDITS.map(({ id }) => id), ["credit-1", "credit-2", "credit-3", "credit-4", "credit-5"]);

  const paymentIds = PAYMENT_GROUPS.flatMap(({ options }) => options.map(([id]) => id));
  for (const account of [...DEFAULT_ADVANCES, ...DEFAULT_CREDITS]) assert.ok(paymentIds.includes(account.id));
});

test("excludes advance and credit activity from the monthly budget", () => {
  const monthlyExpenses = expensesForMonth(SEED_EXPENSES, "2026-08");
  const budgetSpend = monthlyExpenses.filter(isBudgetExpense).reduce((sum, expense) => sum + expense.amount, 0);
  const excludedSpend = monthlyExpenses.filter((expense) => !isBudgetExpense(expense)).reduce((sum, expense) => sum + expense.amount, 0);

  assert.equal(budgetSpend, 9619);
  assert.equal(excludedSpend, 2999);
  assert.equal(isBudgetExpense({ payment: "upi" }), true);
  assert.equal(isBudgetExpense({ payment: "advance-3" }), false);
  assert.equal(isBudgetExpense({ payment: "credit-5" }), false);
});

test("recalculates monthly advance and credit usage against the defined amounts", () => {
  const expenses = [
    { payment: "advance-1", amount: 1200, date: "2026-09-01", status: "actual" },
    { payment: "advance-1", amount: 300, date: "2026-09-05", status: "actual" },
    { payment: "advance-1", amount: 900, date: "2026-08-29", status: "actual" },
    { payment: "advance-1", amount: 500, date: "2026-09-20", status: "planned" },
    { payment: "credit-1", amount: 2100, date: "2026-09-06", status: "actual" },
  ];
  const advance = ledgerUsageForMonth(expenses, [{ id: "advance-1", label: "Advance 1", amountPaid: 5000 }], "2026-09", "advance");
  const credit = ledgerUsageForMonth(expenses, [{ id: "credit-1", label: "Credit 1", creditLimit: 10000 }], "2026-09", "credit");

  assert.deepEqual({ used: advance.used, defined: advance.defined, available: advance.available }, { used: 1500, defined: 5000, available: 3500 });
  assert.deepEqual({ used: credit.used, defined: credit.defined, available: credit.available }, { used: 2100, defined: 10000, available: 7900 });
});

test("uses the current calendar date in India instead of a fixed demo date", () => {
  assert.equal(indiaDateKey(new Date("2026-08-31T19:00:00.000Z")), "2026-09-01");
  assert.equal(indiaDateKey(new Date("2026-08-31T18:29:59.000Z")), "2026-08-31");
});

test("uses IST for time-sensitive greetings", () => {
  assert.equal(indiaGreeting(new Date("2026-09-01T05:00:00.000Z")), "Good morning");
  assert.equal(indiaGreeting(new Date("2026-09-01T08:30:00.000Z")), "Good afternoon");
  assert.equal(indiaGreeting(new Date("2026-09-01T13:00:00.000Z")), "Good evening");
});

test("includes requested family, medicine, connectivity and fund fee categories", () => {
  const monthly = Object.fromEntries(CATEGORY_GROUPS.monthly.map((group) => [group.name, group.subcategories]));
  assert.deepEqual(monthly["Family Pocket Money"], ["Mother", "Father", "Brother", "Sister", "Wife", "Son 1", "Son 2", "Son 3", "Son 4", "Son 5", "Daughter 1", "Daughter 2", "Daughter 3", "Daughter 4", "Daughter 5"]);
  assert.ok(monthly.Medicines.includes("Father"));
  assert.ok(monthly.Medicines.includes("Daughter 5"));
  assert.ok(monthly["Mobile, Internet & Media"].includes("Postpaid Mobile Bill"));
  assert.ok(monthly["Mobile, Internet & Media"].includes("WiFi Bill"));
  const oneOff = CATEGORY_GROUPS["one-off"].find((group) => group.name === "Investment & Fund Management Fees");
  assert.deepEqual(oneOff.subcategories, ["Quarterly Fund Management Fees", "Half Yearly Fund Management Fees", "Yearly Fund Management Fees"]);
});

test("provides frequency-specific quick amount selections", () => {
  assert.deepEqual(QUICK_AMOUNTS.daily, [5, 10, 20, 100]);
  assert.deepEqual(QUICK_AMOUNTS.weekly, [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
  assert.deepEqual(QUICK_AMOUNTS.monthly, [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
  assert.deepEqual(QUICK_AMOUNTS["one-off"], [10000, 20000, 30000, 40000, 50000]);
});

test("creates a complete editable default budget and ledger state", () => {
  const state = createDefaultState();
  assert.equal(state.monthlyBudget, 50000);
  assert.equal(state.advanceAccounts.length, 5);
  assert.equal(state.creditAccounts.length, 5);
  assert.deepEqual(state.archivedExpenses, []);
  assert.equal(state.profilePhoto, "");
  assert.deepEqual(state.appearance, { mode: "light", palette: "heritage", look: "soft" });
  assert.ok(state.expenses.every((expense) => CATEGORY_LIBRARY[expense.frequency].includes(expense.category)));
  assert.ok(state.expenses.every((expense) => CATEGORY_GROUPS[expense.frequency].some((group) => group.name === expense.categoryGroup && group.subcategories.includes(expense.subcategory))));
  const planned = state.expenses.filter(isPlannedExpense);
  assert.equal(planned.length, 1);
  assert.equal(planned[0].reminder, "both");
  assert.ok(planned[0].planNote.length > 0);
});

test("stores and retrieves independent monthly budgets", () => {
  const initial = createDefaultState();
  const updated = withBudgetForMonth(initial, "2026-07", 42000);

  assert.equal(getBudgetForMonth(updated, "2026-07"), 42000);
  assert.equal(getBudgetForMonth(updated, "2026-08"), 50000);
  assert.equal(updated.monthlyBudget, 50000);
  assert.equal(monthLabel("2026-07"), "July 2026");
  assert.equal(shiftMonthKey("2026-01", -1), "2025-12");
  assert.equal(expensesForMonth(updated.expenses, "2026-09").length, 1);
});
