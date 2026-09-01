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
  expensesForMonth,
  getBudgetForMonth,
  monthLabel,
  shiftMonthKey,
  withBudgetForMonth,
  isPlannedExpense,
  upsertExpenseWithArchive,
} from "../src/domain.js";

test("provides broad category libraries for every expense frequency", () => {
  assert.deepEqual(Object.keys(CATEGORY_LIBRARY), ["daily", "weekly", "monthly", "one-off"]);
  for (const categories of Object.values(CATEGORY_LIBRARY)) {
    assert.ok(categories.length >= 15);
    assert.equal(new Set(categories).size, categories.length);
  }
  for (const frequency of Object.keys(CATEGORY_LIBRARY)) {
    assert.deepEqual(CATEGORY_GROUPS[frequency].flatMap((group) => group.subcategories).sort(), [...CATEGORY_LIBRARY[frequency]].sort());
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

test("uses the current calendar date in India instead of a fixed demo date", () => {
  assert.equal(indiaDateKey(new Date("2026-08-31T19:00:00.000Z")), "2026-09-01");
  assert.equal(indiaDateKey(new Date("2026-08-31T18:29:59.000Z")), "2026-08-31");
});

test("creates a complete editable default budget and ledger state", () => {
  const state = createDefaultState();
  assert.equal(state.monthlyBudget, 50000);
  assert.equal(state.advanceAccounts.length, 5);
  assert.equal(state.creditAccounts.length, 5);
  assert.deepEqual(state.archivedExpenses, []);
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
