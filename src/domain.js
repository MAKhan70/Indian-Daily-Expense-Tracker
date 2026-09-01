export const STORAGE_KEY = "pocket-ledger-v2";
export const LEGACY_STORAGE_KEY = "pocket-ledger-v1";
export const DISPLAY_DATE = "2026-08-31";
export const DISPLAY_MONTH = "2026-08";

export const FREQUENCIES = [
  { id: "daily", label: "Daily", description: "Everyday essentials and routine purchases" },
  { id: "weekly", label: "Weekly", description: "Planned weekly shops, services and outings" },
  { id: "monthly", label: "Monthly", description: "Bills, EMIs, fees and subscriptions" },
  { id: "one-off", label: "One-off", description: "Occasional, seasonal and exceptional spending" },
];

export const CATEGORY_LIBRARY = {
  daily: [
    "Groceries", "Vegetables & Fruits", "Milk & Dairy", "Breakfast", "Lunch", "Dinner",
    "Tea & Snacks", "Local Transport", "Fuel", "Parking & Tolls", "Medicines", "Household Supplies",
    "Personal Care", "Domestic Help", "School Daily", "Pet Care", "Work Expense", "Miscellaneous Daily",
  ],
  weekly: [
    "Weekly Groceries", "Farmers Market", "Family Dining", "Family Outing", "Laundry & Dry Cleaning",
    "Home Cleaning", "Religious & Community", "Kids Allowance", "Meal Preparation", "Vehicle Upkeep",
    "Sports & Fitness", "Hobbies", "Weekly Commute", "Caregiver", "Miscellaneous Weekly",
  ],
  monthly: [
    "Rent", "Home Loan EMI", "Society Maintenance", "Electricity", "Water", "LPG / Gas", "Mobile Bill",
    "Broadband", "DTH / Streaming", "Insurance", "School Fees", "Tuition", "Domestic Help Salary",
    "Loan EMI", "Medical Care", "Monthly Groceries", "Fuel Budget", "Subscriptions", "Taxes", "Investments",
    "Professional Fees", "Miscellaneous Monthly",
  ],
  "one-off": [
    "Appliances", "Furniture", "Electronics", "Medical Emergency", "Travel & Holiday", "Festival",
    "Gifts", "Wedding & Events", "Home Repair", "Home Renovation", "Vehicle Repair", "Vehicle Purchase",
    "Education Admission", "Legal Fees", "Relocation", "Jewellery", "Donation", "Large Purchase",
    "Emergency Support", "Miscellaneous One-off",
  ],
};

export const PAYMENT_GROUPS = [
  {
    label: "Everyday",
    options: [
      ["cash", "Cash"], ["upi", "UPI"], ["net-banking", "Net Banking"],
      ["debit-card", "Debit Card"], ["credit-card", "Credit Card"], ["mobile-wallet", "Mobile Wallet"],
    ],
  },
  {
    label: "Bank & recurring",
    options: [
      ["bank-transfer", "Bank Transfer"], ["neft", "NEFT"], ["rtgs", "RTGS"], ["imps", "IMPS"],
      ["auto-debit", "Auto-debit / ECS"], ["cheque", "Cheque"], ["demand-draft", "Demand Draft"],
    ],
  },
  {
    label: "Pay later & other",
    options: [
      ["bnpl", "Buy Now, Pay Later"], ["emi", "EMI / Loan"], ["prepaid", "Prepaid Card"],
      ["voucher", "Gift Card / Voucher"], ["reimbursement", "Reimbursement"], ["other", "Other"],
    ],
  },
  {
    label: "Advance payments",
    options: Array.from({ length: 5 }, (_, index) => [`advance-${index + 1}`, `Advance Payment ${index + 1}`]),
  },
  {
    label: "Credit borrow",
    options: Array.from({ length: 5 }, (_, index) => [`credit-${index + 1}`, `Credit Borrow ${index + 1}`]),
  },
];

export const DEFAULT_ALIASES = Object.fromEntries(
  PAYMENT_GROUPS.flatMap((group) => group.options).map(([id, label]) => [id, label]),
);

export const DEFAULT_ADVANCES = Array.from({ length: 5 }, (_, index) => ({
  id: `advance-${index + 1}`,
  label: `Advance Payment ${index + 1}`,
  merchant: index === 0 ? "Fresh Basket Store" : "",
  amountPaid: index === 0 ? 5000 : 0,
}));

export const DEFAULT_CREDITS = Array.from({ length: 5 }, (_, index) => ({
  id: `credit-${index + 1}`,
  label: `Credit Borrow ${index + 1}`,
  merchant: index === 0 ? "Neighbourhood Pharmacy" : "",
  creditLimit: index === 0 ? 10000 : 0,
}));

export const SEED_EXPENSES = [
  { id: "seed-1", name: "Vegetables & fruits", merchant: "D Mart", amount: 620, category: "Vegetables & Fruits", frequency: "daily", payment: "upi", date: DISPLAY_DATE, time: "09:42", color: "sage" },
  { id: "seed-2", name: "Lunch", merchant: "Swiggy", amount: 280, category: "Lunch", frequency: "daily", payment: "upi", date: DISPLAY_DATE, time: "13:15", color: "turmeric" },
  { id: "seed-3", name: "Auto", merchant: "Office commute", amount: 120, category: "Local Transport", frequency: "daily", payment: "cash", date: DISPLAY_DATE, time: "08:55", color: "plum" },
  { id: "seed-4", name: "Electricity bill", merchant: "BESCOM", amount: 1950, category: "Electricity", frequency: "monthly", payment: "net-banking", date: "2026-08-28", time: "19:31", color: "violet" },
  { id: "seed-5", name: "Medicines", merchant: "Neighbourhood Pharmacy", amount: 1199, category: "Medicines", frequency: "daily", payment: "credit-1", date: DISPLAY_DATE, time: "16:20", color: "rose" },
  { id: "seed-6", name: "Festival sweets advance", merchant: "Fresh Basket Store", amount: 1800, category: "Festival", frequency: "one-off", payment: "advance-1", date: "2026-08-30", time: "18:10", color: "blue" },
  { id: "seed-7", name: "Weekly groceries", merchant: "Reliance Fresh", amount: 2450, category: "Weekly Groceries", frequency: "weekly", payment: "debit-card", date: "2026-08-29", time: "11:10", color: "sage" },
  { id: "seed-8", name: "Monthly broadband", merchant: "Airtel Xstream", amount: 999, category: "Broadband", frequency: "monthly", payment: "auto-debit", date: "2026-08-05", time: "07:30", color: "blue" },
  { id: "seed-9", name: "Home repair", merchant: "Ramesh Electricals", amount: 3200, category: "Home Repair", frequency: "one-off", payment: "bank-transfer", date: "2026-08-18", time: "17:00", color: "plum" },
  { id: "seed-plan-1", name: "September school activity", merchant: "Greenwood School", amount: 2400, category: "School Fees", frequency: "monthly", payment: "net-banking", date: "2026-09-07", time: "09:00", color: "turmeric", status: "planned", planNote: "Confirm the final activity fee with the class teacher before paying.", reminder: "both" },
];

export const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const titleCaseDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T12:00:00+05:30`));

export const isAdvancePayment = (payment) => String(payment).startsWith("advance-");
export const isCreditBorrow = (payment) => String(payment).startsWith("credit-");
export const isBudgetExpense = (expense) => !isAdvancePayment(expense.payment) && !isCreditBorrow(expense.payment);
export const isDisplayMonth = (expense) => String(expense.date).startsWith(DISPLAY_MONTH);
export const isPlannedExpense = (expense) => expense.status === "planned";
export const isMonthKey = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value));

export function shiftMonthKey(monthKey, delta) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const [year, month] = safeMonth.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + Number(delta || 0), 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(monthKey) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${safeMonth}-01T12:00:00Z`));
}

export const expensesForMonth = (expenses, monthKey) =>
  expenses.filter((expense) => String(expense.date).startsWith(isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH));

export function getBudgetForMonth(state, monthKey) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const stored = Number(state.monthlyBudgets?.[safeMonth]);
  if (Number.isFinite(stored) && stored >= 0) return stored;
  return Math.max(Number(state.monthlyBudget) || 0, 0);
}

export function withBudgetForMonth(state, monthKey, amount) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const monthlyBudget = Math.max(Number(amount) || 0, 0);
  return {
    ...state,
    monthlyBudget: safeMonth === DISPLAY_MONTH ? monthlyBudget : state.monthlyBudget,
    monthlyBudgets: { ...(state.monthlyBudgets || {}), [safeMonth]: monthlyBudget },
  };
}

export function normalizeExpense(expense) {
  const frequency = FREQUENCIES.some((item) => item.id === expense.frequency) ? expense.frequency : "daily";
  return {
    ...expense,
    frequency,
    category: expense.category || CATEGORY_LIBRARY[frequency][0],
    status: expense.status === "planned" ? "planned" : "actual",
    planNote: expense.planNote || "",
    reminder: ["month", "week", "both", "none"].includes(expense.reminder) ? expense.reminder : "both",
  };
}

export function buildAliases(state) {
  return {
    ...DEFAULT_ALIASES,
    ...(state.aliases || {}),
    ...Object.fromEntries((state.advanceAccounts || []).map((account) => [account.id, account.label || DEFAULT_ALIASES[account.id]])),
    ...Object.fromEntries((state.creditAccounts || []).map((account) => [account.id, account.label || DEFAULT_ALIASES[account.id]])),
  };
}

export function createDefaultState() {
  return {
    expenses: SEED_EXPENSES.map(normalizeExpense),
    archivedExpenses: [],
    advanceAccounts: DEFAULT_ADVANCES,
    creditAccounts: DEFAULT_CREDITS,
    monthlyBudget: 50000,
    monthlyBudgets: { [DISPLAY_MONTH]: 50000 },
    aliases: DEFAULT_ALIASES,
    dark: false,
  };
}

export function upsertExpenseWithArchive(state, nextExpense, archivedAt = new Date().toISOString(), archiveId = crypto.randomUUID()) {
  const prior = state.expenses.find((item) => item.id === nextExpense.id);
  if (!prior) return { ...state, expenses: [nextExpense, ...state.expenses], archivedExpenses: state.archivedExpenses || [] };
  const archive = { ...prior, archiveId, archivedAt, archiveReason: "Edited" };
  return {
    ...state,
    expenses: state.expenses.map((item) => item.id === nextExpense.id ? nextExpense : item),
    archivedExpenses: [archive, ...(state.archivedExpenses || [])],
  };
}

export function deleteExpenseWithArchive(state, id, archivedAt = new Date().toISOString(), archiveId = crypto.randomUUID()) {
  const prior = state.expenses.find((item) => item.id === id);
  if (!prior) return state;
  const archive = { ...prior, archiveId, archivedAt, archiveReason: "Deleted" };
  return {
    ...state,
    expenses: state.expenses.filter((item) => item.id !== id),
    archivedExpenses: [archive, ...(state.archivedExpenses || [])],
  };
}

export function loadState() {
  const fallback = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.expenses)) return fallback;
    const monthlyBudget = Math.max(Number(parsed.monthlyBudget) || 50000, 0);
    return {
      expenses: parsed.expenses.map(normalizeExpense),
      archivedExpenses: Array.isArray(parsed.archivedExpenses) ? parsed.archivedExpenses : [],
      advanceAccounts: Array.isArray(parsed.advanceAccounts) ? parsed.advanceAccounts : DEFAULT_ADVANCES,
      creditAccounts: Array.isArray(parsed.creditAccounts) ? parsed.creditAccounts : DEFAULT_CREDITS,
      monthlyBudget,
      monthlyBudgets: {
        ...(parsed.monthlyBudgets && typeof parsed.monthlyBudgets === "object" ? parsed.monthlyBudgets : {}),
        [DISPLAY_MONTH]: parsed.monthlyBudgets?.[DISPLAY_MONTH] ?? monthlyBudget,
      },
      aliases: { ...DEFAULT_ALIASES, ...(parsed.aliases || {}) },
      dark: Boolean(parsed.dark),
    };
  } catch {
    return fallback;
  }
}
