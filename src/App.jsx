import { useEffect, useMemo, useState } from "react";
import {
  ArrowsClockwise, Bank, CalendarBlank, ChartBar, ChartDonut,
  Check, CreditCard, DownloadSimple, GearSix, HandCoins, House, MagnifyingGlass,
  Moon, PencilSimple, Plus, Receipt, ShoppingBag, SlidersHorizontal, Tag, Trash,
  TrendDown, Wallet, X,
} from "@phosphor-icons/react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/playfair-display/600.css";
import {
  buildAliases, CATEGORY_LIBRARY, createDefaultState, deleteExpenseWithArchive, DISPLAY_DATE, DISPLAY_MONTH,
  formatINR, FREQUENCIES, isAdvancePayment, isBudgetExpense, isCreditBorrow,
  isDisplayMonth, loadState, PAYMENT_GROUPS, STORAGE_KEY, titleCaseDate, upsertExpenseWithArchive,
} from "./domain.js";
import { LedgerView } from "./LedgerView.jsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: House },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "ledger", label: "Ledger", icon: CalendarBlank },
  { id: "budget", label: "Budget & Ledgers", icon: ChartDonut },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "reports", label: "Analytics", icon: ChartBar },
  { id: "settings", label: "Settings", icon: GearSix },
];

const FREQUENCY_LABELS = Object.fromEntries(FREQUENCIES.map((item) => [item.id, item.label]));

function paymentIcon(id) {
  if (String(id).includes("card") || isCreditBorrow(id)) return CreditCard;
  if (String(id).includes("bank") || ["neft", "rtgs", "imps"].includes(id)) return Bank;
  if (isAdvancePayment(id) || id === "reimbursement") return HandCoins;
  return Wallet;
}

function paymentClass(payment) {
  if (isAdvancePayment(payment)) return "Advance — outside budget";
  if (isCreditBorrow(payment)) return "Credit — outside budget";
  return "Monthly budget";
}

function FrequencyTabs({ value, onChange, includeAll = false, label = "Expense frequency" }) {
  const items = includeAll ? [{ id: "all", label: "All" }, ...FREQUENCIES] : FREQUENCIES;
  return (
    <nav className="frequency-tabs" aria-label={label} role="tablist">
      {items.map((item) => (
        <button key={item.id} type="button" role="tab" aria-selected={value === item.id} className={value === item.id ? "active" : ""} onClick={() => onChange(item.id)}>{item.label}</button>
      ))}
    </nav>
  );
}

function Sidebar({ active, onNavigate, dark, onToggleDark, budgetSpent, monthlyBudget }) {
  const percent = monthlyBudget > 0 ? Math.round((budgetSpent / monthlyBudget) * 100) : 0;
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-block"><span className="brand-mark" aria-hidden="true"><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><span>Daily Expense Tracker</span></div></div>
      <nav className="sidebar-nav">{NAV_ITEMS.map((item) => { const Icon = item.icon; return <button className={active === item.id ? "nav-item active" : "nav-item"} key={item.id} onClick={() => onNavigate(item.id)} aria-current={active === item.id ? "page" : undefined}><Icon size={21} weight={active === item.id ? "fill" : "regular"} /><span>{item.label}</span></button>; })}</nav>
      <div className="sidebar-foot"><div className="month-note"><span>August budget</span><strong>{formatINR(budgetSpent)} spent</strong><small><TrendDown size={14} /> {percent}% of {formatINR(monthlyBudget)}</small></div><button className="theme-toggle" onClick={onToggleDark} aria-pressed={dark}><Moon size={19} /><span>Dark mode</span><i aria-hidden="true" /></button></div>
    </aside>
  );
}

function MobileNav({ active, onNavigate, onAdd }) {
  const items = NAV_ITEMS.slice(0, 4);
  return <nav className="mobile-nav" aria-label="Mobile navigation">{items.map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onNavigate(item.id)}><Icon size={21} weight={active === item.id ? "fill" : "regular"} /><span>{item.label.replace(" & Ledgers", "")}</span></button>; })}<button className="mobile-add" onClick={onAdd} aria-label="Add expense"><Plus size={24} weight="bold" /></button></nav>;
}

function Header({ active, onAdd, onToggleMenu }) {
  const label = NAV_ITEMS.find((item) => item.id === active)?.label || "Dashboard";
  return <header className="page-header"><button className="mobile-menu" onClick={onToggleMenu} aria-label="Open navigation"><SlidersHorizontal size={22} /></button><div><p>{titleCaseDate(DISPLAY_DATE)}</p><h1>{active === "dashboard" ? "Good morning, Ananya" : label}</h1><span>{active === "dashboard" ? "Plan by rhythm. Spend mindfully." : "Keep every rupee clear and accounted for."}</span></div><button className="primary-button header-add" onClick={onAdd}><Plus size={19} weight="bold" /> Log expense</button></header>;
}

function BudgetHero({ spent, monthlyBudget }) {
  const remaining = Math.max(monthlyBudget - spent, 0);
  const used = monthlyBudget > 0 ? Math.min((spent / monthlyBudget) * 100, 100) : 0;
  const chart = [{ name: "Monthly budget", value: used, fill: spent > monthlyBudget ? "#b45555" : "#648955" }];
  return <section className="safe-panel" aria-labelledby="safe-title"><div className="safe-chart" aria-label={`${Math.round(used)} percent of monthly budget used`}><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="82%" outerRadius="100%" data={chart} startAngle={205} endAngle={-25} barSize={18}><PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /><RadialBar dataKey="value" background={{ fill: "var(--track)" }} cornerRadius={12} /></RadialBarChart></ResponsiveContainer><div className="safe-copy"><span id="safe-title">Monthly budget left</span><strong>{formatINR(remaining)}</strong><small>of {formatINR(monthlyBudget)} budget</small></div></div><div className="safe-stats"><div><span>Budget spend</span><strong>{formatINR(spent)}</strong></div><div><span>Budget</span><strong>{formatINR(monthlyBudget)}</strong></div><div><span>Remaining</span><strong className="positive">{formatINR(remaining)}</strong></div></div><p className="budget-rule"><Check size={15} weight="bold" /> Advance and Credit are excluded</p></section>;
}

function SpendingMix({ expenses, frequency }) {
  const totals = CATEGORY_LIBRARY[frequency].map((category) => ({ category, total: expenses.filter((e) => e.category === category).reduce((sum, e) => sum + Number(e.amount), 0) })).sort((a, b) => b.total - a.total);
  const cards = totals.slice(0, 3);
  const max = Math.max(...cards.map((item) => item.total), 1);
  return <section className="envelope-section" aria-labelledby="mix-title"><div className="section-heading"><div><h2 id="mix-title">{FREQUENCY_LABELS[frequency]} spending mix</h2><small>{CATEGORY_LIBRARY[frequency].length} categories available</small></div></div><div className="envelopes">{cards.map((item, index) => { const tones = ["sage", "turmeric", "plum"]; return <article className={`envelope ${tones[index]}`} key={item.category}><span className="envelope-icon"><ShoppingBag size={21} weight="duotone" /></span><h3>{item.category}</h3><p>{formatINR(item.total)}</p><progress max={max} value={item.total} aria-label={`${item.category}: ${formatINR(item.total)}`} /><strong>{item.total ? "Tracked" : "No spend"}</strong></article>; })}</div><p className="on-track"><Check size={17} weight="bold" /> Advance and Credit activity stays outside your budget.</p></section>;
}

function TransactionRow({ expense, aliases, onEdit }) {
  const Icon = paymentIcon(expense.payment);
  return <button className="transaction-row" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.name}, ${formatINR(expense.amount)}`}><span className={`transaction-icon ${expense.color || "sage"}`}><Icon size={19} weight="duotone" /></span><span className="transaction-name"><strong>{expense.name}</strong><small>{expense.merchant || expense.category}</small></span><span className="transaction-payment"><Icon size={17} /> {aliases[expense.payment] || expense.payment}</span><span className="transaction-time"><b className={`frequency-badge ${expense.frequency}`}>{FREQUENCY_LABELS[expense.frequency]}</b><small>{expense.date === DISPLAY_DATE ? "Today" : expense.date}</small></span><strong className="transaction-amount">−{formatINR(expense.amount)}</strong><PencilSimple className="transaction-edit" size={16} /></button>;
}

function TransactionList({ expenses, aliases, onEdit, limit }) {
  const visible = limit ? expenses.slice(0, limit) : expenses;
  return <div className="transaction-list">{visible.length ? visible.map((expense) => <TransactionRow key={expense.id} expense={expense} aliases={aliases} onEdit={onEdit} />) : <div className="empty-state"><Receipt size={30} /><strong>No expenses found</strong><span>Try another filter or log a new expense.</span></div>}</div>;
}

function Dashboard({ expenses, aliases, frequency, monthlyBudget, budgetSpent, onEdit, onViewAll }) {
  const selected = expenses.filter((expense) => expense.frequency === frequency);
  return <div className="dashboard-grid"><BudgetHero spent={budgetSpent} monthlyBudget={monthlyBudget} /><SpendingMix expenses={selected} frequency={frequency} /><section className="recent-section"><div className="section-heading"><h2>Recent {FREQUENCY_LABELS[frequency].toLowerCase()} transactions</h2><button className="text-button" onClick={onViewAll}>View all</button></div><TransactionList expenses={selected} aliases={aliases} onEdit={onEdit} limit={5} /></section></div>;
}

function TransactionsView({ expenses, aliases, frequency, onEdit, onAdd }) {
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("all");
  const filtered = expenses.filter((expense) => { const matchesText = `${expense.name} ${expense.merchant} ${expense.category}`.toLowerCase().includes(query.toLowerCase()); return expense.frequency === frequency && matchesText && (payment === "all" || expense.payment === payment); });
  return <section className="module-card"><div className="module-toolbar"><label className="search-field"><MagnifyingGlass size={19} /><span className="visually-hidden">Search expenses</span><input name="expense-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${FREQUENCY_LABELS[frequency].toLowerCase()} expenses`} /></label><label className="compact-select"><span className="visually-hidden">Filter by payment method</span><select name="payment-filter" value={payment} onChange={(event) => setPayment(event.target.value)}><option value="all">All payment methods</option>{PAYMENT_GROUPS.map((group) => <optgroup label={group.label} key={group.label}>{group.options.map(([id]) => <option value={id} key={id}>{aliases[id]}</option>)}</optgroup>)}</select></label><button className="primary-button" onClick={onAdd}><Plus size={18} /> Add expense</button></div><p className="result-count">{filtered.length} {FREQUENCY_LABELS[frequency].toLowerCase()} {filtered.length === 1 ? "expense" : "expenses"}</p><TransactionList expenses={filtered} aliases={aliases} onEdit={onEdit} /></section>;
}

function AccountCard({ account, kind, used, onChange }) {
  const isAdvance = kind === "advance";
  const capacity = Number(isAdvance ? account.amountPaid : account.creditLimit) || 0;
  const remaining = Math.max(capacity - used, 0);
  const prefix = isAdvance ? "advance" : "credit";
  return <article className={`ledger-card ${prefix}`}><div className="ledger-title"><span className="ledger-icon">{isAdvance ? <HandCoins size={20} /> : <CreditCard size={20} />}</span><div><strong>{account.label}</strong><small>{isAdvance ? "Prepaid merchant balance" : "Merchant credit ceiling"}</small></div></div><div className="ledger-fields"><label htmlFor={`${prefix}-label-${account.id}`}><span>Account name</span><input id={`${prefix}-label-${account.id}`} name={`${prefix}-label-${account.id}`} value={account.label} maxLength="36" onChange={(event) => onChange({ label: event.target.value })} /></label><label htmlFor={`${prefix}-merchant-${account.id}`}><span>Merchant / shop</span><input id={`${prefix}-merchant-${account.id}`} name={`${prefix}-merchant-${account.id}`} value={account.merchant} placeholder="Add merchant name" maxLength="80" onChange={(event) => onChange({ merchant: event.target.value })} /></label><label htmlFor={`${prefix}-amount-${account.id}`}><span>{isAdvance ? "Advance paid (₹)" : "Credit limit (₹)"}</span><input id={`${prefix}-amount-${account.id}`} name={`${prefix}-amount-${account.id}`} type="number" inputMode="decimal" min="0" max="1000000000" value={capacity || ""} placeholder="0" onChange={(event) => onChange({ [isAdvance ? "amountPaid" : "creditLimit"]: Math.max(Number(event.target.value) || 0, 0) })} /></label></div><div className="ledger-balance"><span>Used <b>{formatINR(used)}</b></span><span>Available <strong>{formatINR(remaining)}</strong></span></div><progress max={Math.max(capacity, 1)} value={Math.min(used, capacity)} aria-label={`${account.label}: ${formatINR(used)} used of ${formatINR(capacity)}`} /></article>;
}

function BudgetView({ monthlyBudget, budgetSpent, expenses, advanceAccounts, creditAccounts, onBudgetChange, onAccountChange }) {
  const [budgetDraft, setBudgetDraft] = useState(String(monthlyBudget));
  useEffect(() => setBudgetDraft(String(monthlyBudget)), [monthlyBudget]);
  const percent = monthlyBudget > 0 ? Math.min(Math.round((budgetSpent / monthlyBudget) * 100), 100) : 0;
  const usage = (id) => expenses.filter((expense) => expense.payment === id).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const submitBudget = (event) => { event.preventDefault(); onBudgetChange(Math.max(Number(budgetDraft) || 0, 0)); };
  return <div className="budget-stack"><section className="module-card budget-view budget-summary"><div className="module-intro"><div><h2>Monthly budget</h2><p>All Daily, Weekly, Monthly and One-off spending is included, except Advance and Credit.</p></div><strong>{percent}%</strong></div><progress max="100" value={percent} className="master-progress" /><div className="budget-kpis"><div><span>Budget</span><strong>{formatINR(monthlyBudget)}</strong></div><div><span>Budget spend</span><strong>{formatINR(budgetSpent)}</strong></div><div><span>Remaining</span><strong className="positive">{formatINR(Math.max(monthlyBudget - budgetSpent, 0))}</strong></div></div><form className="budget-form" action="#" onSubmit={submitBudget}><label htmlFor="monthly-budget"><span>Monthly budget amount (₹)</span><input id="monthly-budget" name="monthly-budget" type="number" inputMode="decimal" min="0" max="1000000000" value={budgetDraft} onChange={(event) => setBudgetDraft(event.target.value)} required /></label><button className="primary-button" type="submit">Save budget</button></form></section><section className="module-card ledger-section"><div className="section-heading"><div><h2>Advance Payment 1–5</h2><small>Add each merchant and the advance amount already paid.</small></div><span className="outside-budget">Outside monthly budget</span></div><div className="ledger-grid">{advanceAccounts.map((account) => <AccountCard key={account.id} account={account} kind="advance" used={usage(account.id)} onChange={(accountPatch) => onAccountChange("advance", account.id, accountPatch)} />)}</div></section><section className="module-card ledger-section"><div className="section-heading"><div><h2>Credit Borrow 1–5</h2><small>Add each merchant and set the maximum credit you allow.</small></div><span className="outside-budget">Outside monthly budget</span></div><div className="ledger-grid">{creditAccounts.map((account) => <AccountCard key={account.id} account={account} kind="credit" used={usage(account.id)} onChange={(accountPatch) => onAccountChange("credit", account.id, accountPatch)} />)}</div></section></div>;
}

function CategoriesView({ expenses, frequency }) {
  const totals = CATEGORY_LIBRARY[frequency].map((category) => ({ category, total: expenses.filter((e) => e.frequency === frequency && e.category === category).reduce((sum, e) => sum + Number(e.amount), 0) })).sort((a, b) => b.total - a.total);
  const max = Math.max(...totals.map((item) => item.total), 1);
  return <section className="module-card categories-view"><div className="category-header"><div><h2>{FREQUENCY_LABELS[frequency]} spending categories</h2><p className="module-subtitle">A broad category library for Indian household expenses.</p></div><strong>{totals.length} categories</strong></div><div className="category-bars">{totals.map((item) => <div className="category-row" key={item.category}><span>{item.category}</span><progress max={max} value={item.total} /><strong>{item.total ? formatINR(item.total) : "—"}</strong></div>)}</div></section>;
}

function ReportsView({ expenses, aliases, onEdit }) {
  const [frequency, setFrequency] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const scoped = expenses.filter((expense) => frequency === "all" || expense.frequency === frequency);
  const total = scoped.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const budgetTotal = scoped.filter(isBudgetExpense).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const specialTotal = total - budgetTotal;
  const methodRows = Object.entries(scoped.reduce((groups, expense) => { const row = groups[expense.payment] || { total: 0, count: 0 }; groups[expense.payment] = { total: row.total + Number(expense.amount), count: row.count + 1 }; return groups; }, {})).map(([id, values]) => ({ id, ...values, share: total > 0 ? Math.round((values.total / total) * 100) : 0 })).sort((a, b) => b.total - a.total);
  const activeMethod = selectedMethod && methodRows.some((row) => row.id === selectedMethod) ? selectedMethod : methodRows[0]?.id;
  const drilldown = scoped.filter((expense) => expense.payment === activeMethod);
  const selectedRow = methodRows.find((row) => row.id === activeMethod);
  const exportCsv = () => { const safe = (value) => { const text = String(value ?? "").replaceAll('"', '""'); return /^[=+\-@]/.test(text) ? `'${text}` : text; }; const rows = [["Date", "Frequency", "Expense", "Merchant", "Category", "Payment", "Budget treatment", "Amount"], ...scoped.map((e) => [e.date, FREQUENCY_LABELS[e.frequency], e.name, e.merchant, e.category, aliases[e.payment], paymentClass(e.payment), e.amount])]; const csv = rows.map((row) => row.map((cell) => `"${safe(cell)}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "pocket-ledger-analysis.csv"; link.click(); URL.revokeObjectURL(url); };
  return <div className="analytics-stack"><section className="module-card reports-view"><div className="report-head"><div><h2>Payment mode analysis</h2><p>Drill down from each payment method to its underlying expenses.</p></div><button className="secondary-button" onClick={exportCsv}><DownloadSimple size={18} /> Export CSV</button></div><FrequencyTabs value={frequency} onChange={(nextFrequency) => { setFrequency(nextFrequency); setSelectedMethod(null); }} includeAll label="Analytics frequency" /><div className="report-stats"><div><span>Total analysed</span><strong>{formatINR(total)}</strong></div><div><span>Monthly-budget spend</span><strong>{formatINR(budgetTotal)}</strong></div><div><span>Advance + Credit</span><strong>{formatINR(specialTotal)}</strong></div></div><div className="analytics-grid"><div className="method-analysis"><div className="analysis-table-head"><span>Payment mode</span><span>Transactions</span><span>Share</span><span>Total</span></div>{methodRows.map((row) => { const Icon = paymentIcon(row.id); return <button key={row.id} className={activeMethod === row.id ? "method-row active" : "method-row"} onClick={() => setSelectedMethod(row.id)}><span><Icon size={18} /> <b>{aliases[row.id]}</b><small>{paymentClass(row.id)}</small></span><span>{row.count}</span><span>{row.share}%</span><strong>{formatINR(row.total)}</strong><i style={{ "--share": `${row.share}%` }} /></button>; })}</div><div className="drilldown-panel"><div><span>Selected payment mode</span><h3>{aliases[activeMethod] || "No activity"}</h3>{selectedRow && <p>{selectedRow.count} transactions · {selectedRow.share}% of analysed spend</p>}</div><TransactionList expenses={drilldown} aliases={aliases} onEdit={onEdit} /></div></div></section></div>;
}

function SettingsView({ dark, onToggleDark, onReset, installAvailable, installed, onInstall }) {
  return <section className="module-card settings-view"><div className="pwa-install-card"><div className="pwa-icon"><Wallet size={24} weight="fill" /></div><div><strong>{installed ? "Pocket Ledger is installed" : "Install Pocket Ledger"}</strong><span>{installed ? "It can now launch from your home screen in its own app window." : installAvailable ? "Add it to this device for a standalone, offline-capable experience." : "On iPhone, use Share → Add to Home Screen. On Android, use the browser’s Install app option."}</span></div>{!installed && <button className="primary-button" type="button" onClick={onInstall}><DownloadSimple size={18} /> Install app</button>}</div><div className="setting-row"><div><strong>Dark mode</strong><span>Use a lower-light appearance.</span></div><button className={dark ? "switch active" : "switch"} onClick={onToggleDark} aria-pressed={dark}><i /></button></div><div className="settings-section"><h2>Data model</h2><p>Daily, Weekly, Monthly and One-off expenses are stored locally on this device. Monthly budget totals exclude Advance Payment and Credit Borrow entries. Merchant ledgers can be configured under Budget & Ledgers.</p></div><div className="danger-zone"><div><strong>Reset demo data</strong><span>Restore the original sample expenses, monthly budget and merchant ledgers.</span></div><button className="danger-button" onClick={onReset}><ArrowsClockwise size={17} /> Reset</button></div></section>;
}

function AddExpenseDrawer({ expense, aliases, defaultFrequency, initialDate = DISPLAY_DATE, defaultStatus = "actual", requiresDisclaimers = false, monthlyBudget, monthlyBudgetSpent, advanceAccounts, creditAccounts, allExpenses, onClose, onSave, onDelete }) {
  const editing = Boolean(expense);
  const [form, setForm] = useState(() => expense || { amount: "", name: "", merchant: "", category: CATEGORY_LIBRARY[defaultFrequency][0], frequency: defaultFrequency, date: initialDate, time: "12:00", payment: "cash", status: defaultStatus, planNote: "", reminder: "both" });
  const [errors, setErrors] = useState({});
  const [acknowledged, setAcknowledged] = useState([false, false, false]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const changeFrequency = (nextFrequency) => setForm((current) => ({ ...current, frequency: nextFrequency, category: CATEGORY_LIBRARY[nextFrequency][0] }));
  const selectedAdvance = advanceAccounts.find((account) => account.id === form.payment);
  const selectedCredit = creditAccounts.find((account) => account.id === form.payment);
  const isFuture = form.date > DISPLAY_DATE;
  const oldBudgetAmount = editing && isBudgetExpense(expense) && isDisplayMonth(expense) ? Number(expense.amount) : 0;
  const baseBudgetSpent = monthlyBudgetSpent - oldBudgetAmount;
  const projectedBudgetSpent = baseBudgetSpent + (isBudgetExpense(form) && String(form.date).startsWith(DISPLAY_MONTH) ? Number(form.amount) || 0 : 0);
  const ledgerUsed = (payment) => allExpenses.filter((item) => item.payment === payment && item.id !== expense?.id).reduce((sum, item) => sum + Number(item.amount), 0) + (Number(form.amount) || 0);
  const submit = (event) => { event.preventDefault(); const nextErrors = {}; if (!form.name.trim()) nextErrors.name = "Add an expense name."; if (!Number(form.amount) || Number(form.amount) <= 0) nextErrors.amount = "Enter an amount greater than zero."; if (Number(form.amount) > 10000000) nextErrors.amount = "Amount must be below ₹1,00,00,000."; if (!form.payment) nextErrors.payment = "Choose a payment method."; if (editing && requiresDisclaimers && acknowledged.some((value) => !value)) nextErrors.disclaimers = "Please acknowledge all three edit notices before saving."; setErrors(nextErrors); if (Object.keys(nextErrors).length) return; onSave({ ...form, amount: Number(form.amount), name: form.name.trim(), merchant: form.merchant.trim(), status: isFuture ? "planned" : "actual", planNote: isFuture ? (form.planNote || "").trim() : "", reminder: isFuture ? (form.reminder || "both") : "none", id: form.id || crypto.randomUUID(), color: form.color || "sage" }); };
  useEffect(() => { const closeOnEscape = (event) => event.key === "Escape" && onClose(); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [onClose]);
  let impact = <><span>Monthly budget after this expense</span><strong>{formatINR(projectedBudgetSpent)} used <b>{formatINR(Math.max(monthlyBudget - projectedBudgetSpent, 0))} left</b></strong></>;
  if (selectedAdvance) impact = <><span>Advance ledger · {selectedAdvance.merchant || "Merchant not named"}</span><strong>{formatINR(ledgerUsed(form.payment))} used <b>{formatINR(Math.max(Number(selectedAdvance.amountPaid) - ledgerUsed(form.payment), 0))} available</b></strong></>;
  if (selectedCredit) impact = <><span>Credit ledger · {selectedCredit.merchant || "Merchant not named"}</span><strong>{formatINR(ledgerUsed(form.payment))} borrowed <b>{formatINR(Math.max(Number(selectedCredit.creditLimit) - ledgerUsed(form.payment), 0))} available</b></strong></>;
  if (isFuture) impact = <><span>Planned expense · not counted as completed spending</span><strong>{formatINR(Number(form.amount) || 0)} planned <b>{form.reminder === "week" ? "1-week alert" : form.reminder === "month" ? "1-month alert" : form.reminder === "none" ? "No alert" : "Month + week alerts"}</b></strong></>;
  const editNotices = [
    "I understand this will replace the active ledger value.",
    "I understand the previous value will be retained under Archived.",
    "I understand budgets, balances and analytics will recalculate from the revised value.",
  ];
  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close expense form" />
      <aside className="expense-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-head"><div><span>{editing ? "Update your entry" : isFuture ? "Schedule an upcoming payment" : `${FREQUENCY_LABELS[form.frequency]} expense`}</span><h2 id="drawer-title">{editing ? "Edit expense" : isFuture ? "Plan expense" : "Add expense"}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={22} /></button></div>
        <form action="#" onSubmit={submit} noValidate>
          <fieldset className="frequency-fieldset"><legend>Spending frequency</legend><FrequencyTabs value={form.frequency} onChange={changeFrequency} /></fieldset>
          <div className="form-grid two-col">
            <label htmlFor="expense-amount"><span>Amount (₹)</span><input id="expense-amount" name="amount" inputMode="decimal" type="number" min="1" max="10000000" value={form.amount} onChange={(event) => set("amount", event.target.value)} aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? "amount-error" : undefined} autoFocus required />{errors.amount && <small id="amount-error" className="field-error">{errors.amount}</small>}</label>
            <label htmlFor="expense-date"><span>Date</span><input id="expense-date" name="date" type="date" value={form.date} onChange={(event) => set("date", event.target.value)} required /></label>
          </div>
          <label htmlFor="expense-name"><span>Expense name</span><input id="expense-name" name="expense-name" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Vegetable shopping" maxLength="60" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} required />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
          <div className="form-grid two-col">
            <label htmlFor="expense-merchant"><span>Merchant / shop</span><input id="expense-merchant" name="merchant" value={form.merchant} onChange={(event) => set("merchant", event.target.value)} placeholder="Optional" maxLength="80" /></label>
            <label htmlFor="expense-category"><span>{FREQUENCY_LABELS[form.frequency]} category</span><select id="expense-category" name="category" value={form.category} onChange={(event) => set("category", event.target.value)}>{CATEGORY_LIBRARY[form.frequency].map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <label htmlFor="expense-payment"><span>Payment method / mode</span><select id="expense-payment" name="payment" value={form.payment} onChange={(event) => set("payment", event.target.value)} required>{PAYMENT_GROUPS.map((group) => <optgroup label={group.label} key={group.label}>{group.options.map(([id]) => <option value={id} key={id}>{aliases[id]}</option>)}</optgroup>)}</select>{errors.payment && <small className="field-error">{errors.payment}</small>}</label>
          {isFuture && <fieldset className="planned-fields"><legend>Planned expense reminder</legend><label htmlFor="plan-note"><span>Reminder note</span><textarea id="plan-note" name="plan-note" value={form.planNote || ""} onChange={(event) => set("planNote", event.target.value)} placeholder="What should you check or prepare before this expense?" maxLength="240" rows="3" /></label><label htmlFor="plan-reminder"><span>Notify me inside Ledger</span><select id="plan-reminder" name="reminder" value={form.reminder || "both"} onChange={(event) => set("reminder", event.target.value)}><option value="both">One month before and one week before</option><option value="month">One month before</option><option value="week">One week before</option><option value="none">No reminder</option></select></label></fieldset>}
          <div className={`impact-note ${selectedAdvance || selectedCredit || isFuture ? "special" : ""}`}>{impact}</div>
          {editing && requiresDisclaimers && <fieldset className="edit-disclaimers" aria-describedby={errors.disclaimers ? "disclaimer-error" : undefined}><legend>Before saving, acknowledge all 3 notices</legend>{editNotices.map((notice, index) => <label key={notice}><input type="checkbox" name={`edit-notice-${index + 1}`} checked={acknowledged[index]} onChange={(event) => setAcknowledged((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /><span>{index + 1}. {notice}</span></label>)}{errors.disclaimers && <small id="disclaimer-error" className="field-error" role="alert">{errors.disclaimers}</small>}</fieldset>}
          <div className="drawer-actions">{editing && <button type="button" className="delete-button" onClick={() => onDelete(expense.id)}><Trash size={17} /> Delete</button>}<button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={18} weight="bold" /> {editing ? "Save and archive old" : isFuture ? "Save planned expense" : "Save expense"}</button></div>
        </form>
      </aside>
    </div>
  );
}

export function App() {
  const [saved, setSaved] = useState(loadState);
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [active, setActive] = useState(() => { const requested = initialParams.get("view") === "calendar" ? "ledger" : initialParams.get("view"); return NAV_ITEMS.some((item) => item.id === requested) ? requested : "dashboard"; });
  const [frequency, setFrequency] = useState(() => FREQUENCIES.some((item) => item.id === initialParams.get("frequency")) ? initialParams.get("frequency") : "daily");
  const [drawer, setDrawer] = useState(() => { const requestedExpense = saved.expenses.find((item) => item.id === initialParams.get("edit")) || null; return { open: initialParams.get("drawer") === "1" || Boolean(requestedExpense), expense: requestedExpense, initialDate: requestedExpense?.date || (/^\d{4}-\d{2}-\d{2}$/.test(initialParams.get("date") || "") ? initialParams.get("date") : DISPLAY_DATE), defaultStatus: requestedExpense?.status || (initialParams.get("planned") === "1" ? "planned" : "actual"), requiresDisclaimers: Boolean(requestedExpense) && initialParams.get("source") === "ledger" }; });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
  const records = useMemo(() => [...saved.expenses].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)), [saved.expenses]);
  const expenses = useMemo(() => records.filter((record) => record.status !== "planned"), [records]);
  const aliases = useMemo(() => buildAliases(saved), [saved]);
  const budgetSpent = useMemo(() => expenses.filter((expense) => isDisplayMonth(expense) && isBudgetExpense(expense)).reduce((sum, expense) => sum + Number(expense.amount), 0), [expenses]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);
  useEffect(() => { document.documentElement.dataset.theme = saved.dark ? "dark" : "light"; }, [saved.dark]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2600); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const captureInstall = (event) => { event.preventDefault(); setInstallPrompt(event); }; const markInstalled = () => { setInstalled(true); setInstallPrompt(null); }; window.addEventListener("beforeinstallprompt", captureInstall); window.addEventListener("appinstalled", markInstalled); return () => { window.removeEventListener("beforeinstallprompt", captureInstall); window.removeEventListener("appinstalled", markInstalled); }; }, []);

  const closeDrawer = () => setDrawer({ open: false, expense: null, initialDate: DISPLAY_DATE, defaultStatus: "actual", requiresDisclaimers: false });
  const openNew = () => setDrawer({ open: true, expense: null, initialDate: DISPLAY_DATE, defaultStatus: "actual", requiresDisclaimers: false });
  const openLedgerDate = (date, planned) => setDrawer({ open: true, expense: null, initialDate: date, defaultStatus: planned ? "planned" : "actual", requiresDisclaimers: false });
  const openEdit = (expense, fromLedger = false) => { setFrequency(expense.frequency); setDrawer({ open: true, expense, initialDate: expense.date, defaultStatus: expense.status || "actual", requiresDisclaimers: fromLedger }); };
  const saveExpense = (nextExpense) => { setSaved((current) => upsertExpenseWithArchive(current, nextExpense)); closeDrawer(); setToast(drawer.expense ? "Expense updated · old value archived" : nextExpense.status === "planned" ? "Planned expense saved" : "Expense added"); };
  const deleteExpense = (id) => { setSaved((current) => deleteExpenseWithArchive(current, id)); closeDrawer(); setToast("Expense deleted · old value archived"); };
  const navigate = (id) => { setActive(id); setMobileMenu(false); };
  const updateAccount = (kind, id, accountPatch) => { const key = kind === "advance" ? "advanceAccounts" : "creditAccounts"; setSaved((current) => ({ ...current, [key]: current[key].map((account) => account.id === id ? { ...account, ...accountPatch } : account) })); };
  const reset = () => { if (window.confirm("Reset all local expense data, budget and ledgers to the original demo?")) { setSaved(createDefaultState()); setToast("Demo data restored"); } };
  const installApp = async () => { if (!installPrompt) { setToast("Use your browser menu to add Pocket Ledger to the home screen"); return; } await installPrompt.prompt(); const result = await installPrompt.userChoice; if (result.outcome === "accepted") setToast("Pocket Ledger installed"); setInstallPrompt(null); };

  let view;
  if (active === "transactions") view = <TransactionsView expenses={expenses} aliases={aliases} frequency={frequency} onEdit={(expense) => openEdit(expense)} onAdd={openNew} />;
  else if (active === "ledger") view = <LedgerView records={records} archives={saved.archivedExpenses || []} aliases={aliases} onEdit={(expense) => openEdit(expense, true)} onAdd={openLedgerDate} />;
  else if (active === "budget") view = <BudgetView monthlyBudget={saved.monthlyBudget} budgetSpent={budgetSpent} expenses={expenses} advanceAccounts={saved.advanceAccounts} creditAccounts={saved.creditAccounts} onBudgetChange={(monthlyBudget) => { setSaved((current) => ({ ...current, monthlyBudget })); setToast("Monthly budget saved"); }} onAccountChange={updateAccount} />;
  else if (active === "categories") view = <CategoriesView expenses={expenses} frequency={frequency} />;
  else if (active === "reports") view = <ReportsView expenses={expenses} aliases={aliases} onEdit={(expense) => openEdit(expense)} />;
  else if (active === "settings") view = <SettingsView dark={saved.dark} onToggleDark={() => setSaved((current) => ({ ...current, dark: !current.dark }))} onReset={reset} installAvailable={Boolean(installPrompt)} installed={installed} onInstall={installApp} />;
  else view = <Dashboard expenses={expenses} aliases={aliases} frequency={frequency} monthlyBudget={saved.monthlyBudget} budgetSpent={budgetSpent} onEdit={(expense) => openEdit(expense)} onViewAll={() => setActive("transactions")} />;

  const showFrequencyTabs = ["dashboard", "transactions", "categories"].includes(active);
  return <div className="app-shell"><Sidebar active={active} onNavigate={navigate} dark={saved.dark} onToggleDark={() => setSaved((current) => ({ ...current, dark: !current.dark }))} budgetSpent={budgetSpent} monthlyBudget={saved.monthlyBudget} />{mobileMenu && <div className="mobile-menu-sheet"><button className="drawer-backdrop" onClick={() => setMobileMenu(false)} aria-label="Close navigation" /><div>{NAV_ITEMS.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => navigate(item.id)}><Icon size={20} />{item.label}</button>; })}</div></div>}<main className="main-content"><Header active={active} onAdd={openNew} onToggleMenu={() => setMobileMenu(true)} />{showFrequencyTabs && <FrequencyTabs value={frequency} onChange={setFrequency} />}{view}</main><MobileNav active={active} onNavigate={navigate} onAdd={openNew} />{drawer.open && <AddExpenseDrawer key={drawer.expense?.id || `new-${frequency}-${drawer.initialDate}`} expense={drawer.expense} aliases={aliases} defaultFrequency={frequency} initialDate={drawer.initialDate} defaultStatus={drawer.defaultStatus} requiresDisclaimers={drawer.requiresDisclaimers} monthlyBudget={saved.monthlyBudget} monthlyBudgetSpent={budgetSpent} advanceAccounts={saved.advanceAccounts} creditAccounts={saved.creditAccounts} allExpenses={expenses} onClose={closeDrawer} onSave={saveExpense} onDelete={deleteExpense} />}{toast && <div className="toast" role="status"><Check size={18} weight="bold" /> {toast}</div>}</div>;
}
