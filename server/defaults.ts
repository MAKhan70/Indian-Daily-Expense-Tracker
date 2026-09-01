const slots = [1, 2, 3, 4, 5];

export const DEFAULT_ADVANCE_ACCOUNTS = slots.map((slot) => ({
  id: `advance-${slot}`,
  label: `Advance Payment ${slot}`,
  merchant: slot === 1 ? "Fresh Basket Store" : "",
  amountPaid: slot === 1 ? 5000 : 0,
}));

export const DEFAULT_CREDIT_ACCOUNTS = slots.map((slot) => ({
  id: `credit-${slot}`,
  label: `Credit Borrow ${slot}`,
  merchant: slot === 1 ? "Neighbourhood Pharmacy" : "",
  creditLimit: slot === 1 ? 10000 : 0,
}));

export const indiaDateKey = () => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

export const emptyLedgerState = () => {
  const month = indiaDateKey().slice(0, 7);
  return {
    expenses: [],
    archivedExpenses: [],
    advanceAccounts: DEFAULT_ADVANCE_ACCOUNTS,
    creditAccounts: DEFAULT_CREDIT_ACCOUNTS,
    monthlyBudget: 50000,
    monthlyBudgets: { [month]: 50000 },
    aliases: {},
    dark: false,
    appearance: { mode: "light", palette: "heritage", look: "soft" },
    profilePhoto: "",
  };
};
