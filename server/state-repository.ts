import { prisma } from "./prisma.js";
import { emptyLedgerState } from "./defaults.js";
import type { LedgerStateInput } from "./validation.js";

const toMinor = (value: number) => Math.round(Number(value || 0) * 100);
const fromMinor = (value: number) => Number(value || 0) / 100;

export async function readLedgerState(userId: string) {
  const [expenses, archives, budgets, accounts, preference] = await Promise.all([
    prisma.expense.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { time: "desc" }] }),
    prisma.expenseArchive.findMany({ where: { userId }, orderBy: { archivedAt: "desc" } }),
    prisma.monthlyBudget.findMany({ where: { userId } }),
    prisma.paymentAccount.findMany({ where: { userId }, orderBy: [{ kind: "asc" }, { slot: "asc" }] }),
    prisma.userPreference.findUnique({ where: { userId } }),
  ]);
  const hasData = Boolean(expenses.length || archives.length || budgets.length || accounts.length || preference?.localImportCompleted);
  if (!hasData) return { state: emptyLedgerState(), hasData: false };
  const fallback = emptyLedgerState();
  const advanceAccounts = accounts.filter((item) => item.kind === "advance").map((item) => ({ id: item.paymentId, label: item.label, merchant: item.merchant, amountPaid: fromMinor(item.definedAmountMinor) }));
  const creditAccounts = accounts.filter((item) => item.kind === "credit").map((item) => ({ id: item.paymentId, label: item.label, merchant: item.merchant, creditLimit: fromMinor(item.definedAmountMinor) }));
  const monthlyBudgets = Object.fromEntries(budgets.map((item) => [item.month, fromMinor(item.amountMinor)]));
  const currentMonth = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(0, 7);
  return { hasData: true, state: {
    expenses: expenses.map(({ amountMinor, createdAt: _c, updatedAt: _u, userId: _uid, ...item }) => ({ ...item, amount: fromMinor(amountMinor) })),
    archivedExpenses: archives.map(({ id, sourceExpenseId, amountMinor, userId: _uid, ...item }) => ({ ...item, id: sourceExpenseId, archiveId: id, amount: fromMinor(amountMinor), archivedAt: item.archivedAt.toISOString() })),
    advanceAccounts: advanceAccounts.length === 5 ? advanceAccounts : fallback.advanceAccounts,
    creditAccounts: creditAccounts.length === 5 ? creditAccounts : fallback.creditAccounts,
    monthlyBudget: monthlyBudgets[currentMonth] ?? Object.values(monthlyBudgets)[0] ?? fallback.monthlyBudget,
    monthlyBudgets,
    aliases: {},
    dark: preference?.dark ?? false,
    appearance: {
      mode: (["light", "dark", "system"].includes(preference?.themeMode || "") ? preference?.themeMode : (preference?.dark ? "dark" : "light")) as "light" | "dark" | "system",
      palette: (["heritage", "indigo", "ocean", "forest", "rose"].includes(preference?.palette || "") ? preference?.palette : "heritage") as "heritage" | "indigo" | "ocean" | "forest" | "rose",
      look: (["soft", "crisp"].includes(preference?.look || "") ? preference?.look : "soft") as "soft" | "crisp",
    },
    profilePhoto: preference?.profilePhoto ?? "",
  } };
}

export async function replaceLedgerState(userId: string, state: LedgerStateInput, localImportCompleted = true) {
  await prisma.$transaction(async (tx) => {
    await tx.expenseArchive.deleteMany({ where: { userId } });
    await tx.expense.deleteMany({ where: { userId } });
    await tx.monthlyBudget.deleteMany({ where: { userId } });
    await tx.paymentAccount.deleteMany({ where: { userId } });
    if (state.expenses.length) await tx.expense.createMany({ data: state.expenses.map(({ amount, ...item }) => ({ ...item, amountMinor: toMinor(amount), userId })) });
    if (state.archivedExpenses.length) await tx.expenseArchive.createMany({ data: state.archivedExpenses.map(({ archiveId, archivedAt, archiveReason, id, amount, ...item }) => ({ ...item, id: archiveId, sourceExpenseId: id, amountMinor: toMinor(amount), archiveReason, archivedAt: new Date(archivedAt), userId })) });
    const budgets = Object.entries(state.monthlyBudgets).map(([month, amount]) => ({ userId, month, amountMinor: toMinor(amount) }));
    if (budgets.length) await tx.monthlyBudget.createMany({ data: budgets });
    await tx.paymentAccount.createMany({ data: [
      ...state.advanceAccounts.map((item, index) => ({ userId, kind: "advance", slot: index + 1, paymentId: item.id, label: item.label, merchant: item.merchant, definedAmountMinor: toMinor(item.amountPaid) })),
      ...state.creditAccounts.map((item, index) => ({ userId, kind: "credit", slot: index + 1, paymentId: item.id, label: item.label, merchant: item.merchant, definedAmountMinor: toMinor(item.creditLimit) })),
    ] });
    await tx.userPreference.upsert({
      where: { userId },
      create: { userId, dark: state.dark, themeMode: state.appearance.mode, palette: state.appearance.palette, look: state.appearance.look, profilePhoto: state.profilePhoto || null, localImportCompleted },
      update: { dark: state.dark, themeMode: state.appearance.mode, palette: state.appearance.palette, look: state.appearance.look, profilePhoto: state.profilePhoto || null, localImportCompleted },
    });
  });
  return readLedgerState(userId);
}

export async function userHasLedgerData(userId: string) { return (await readLedgerState(userId)).hasData; }
