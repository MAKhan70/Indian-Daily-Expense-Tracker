import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  ArrowsClockwise, Bank, CalendarBlank, CaretDown, CaretLeft, CaretRight, CaretUp, ChartBar, ChartDonut,
  Camera, Check, CreditCard, DownloadSimple, GearSix, HandCoins, House, MagnifyingGlass,
  List, Moon, PencilSimple, Plus, Receipt, ShoppingBag, Sparkle, Sun, Tag, Trash,
  TrendDown, UserCircle, Wallet, X,
} from "@phosphor-icons/react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/playfair-display/600.css";
import {
  activeCategoryGroups, APPEARANCE_DEFAULTS, buildAliases, CATEGORY_LIBRARY, categoryGroupFor, createDefaultState, DEFAULT_ANALYTICS_MODULES, deleteExpenseWithArchive, DISPLAY_DATE, DISPLAY_MONTH,
  expensesForMonth, formatINR, FREQUENCIES, getBudgetForMonth, isAdvancePayment, isBudgetExpense, isCreditBorrow,
  indiaDateKey, indiaGreeting, isDisplayMonth, ledgerUsageForMonth, loadState, managedCategoryGroups, monthLabel, PAYMENT_GROUPS, QUICK_AMOUNTS, restoreCategoryOrder, shiftMonthKey, STORAGE_KEY, titleCaseDate,
  upsertExpenseWithArchive, withBudgetForMonth,
} from "./domain.js";
import { LedgerView } from "./LedgerView.jsx";
import { AuthScreen, ImportChoice, ResetPasswordScreen } from "./AuthScreen.jsx";
import { authClient } from "./auth-client.js";

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
const CHART_COLORS = ["#648955", "#d2a533", "#b96f52", "#77518c", "#5f7f8f", "#9b687a", "#78834b", "#a86646"];

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

function MonthNavigator({ value, onChange, label }) {
  return <div className="month-navigator" role="group" aria-label={label}><button type="button" className="icon-button" onClick={() => onChange(shiftMonthKey(value, -1))} aria-label="Previous month"><CaretLeft /></button><label><span className="visually-hidden">Choose month</span><input type="month" value={value} min="2000-01" max="2100-12" onChange={(event) => onChange(event.target.value || value)} /></label><button type="button" className="icon-button" onClick={() => onChange(shiftMonthKey(value, 1))} aria-label="Next month"><CaretRight /></button></div>;
}

function AccessibleDataTable({ caption, columns, rows }) {
  return <table className="visually-hidden"><caption>{caption}</caption><thead><tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${caption}-${index}`}>{row.map((cell, cellIndex) => <td key={`${caption}-${index}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table>;
}

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((item) => <span key={item.dataKey}>{item.name}: {formatINR(item.value)}</span>)}</div>;
}

async function prepareProfilePhoto(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("Choose a JPG, PNG or WebP image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Choose an image smaller than 8 MB.");
  const bitmap = await createImageBitmap(file);
  const size = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  context.fillStyle = "#fffaf5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

function ProfilePhotoControl({ photo, onFile, id, compact = false }) {
  return <label className={compact ? "profile-photo-control compact" : "profile-photo-control"} htmlFor={id}><input className="visually-hidden" id={id} name={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); event.target.value = ""; }} /><span className="profile-avatar">{photo ? <img src={photo} alt="Profile" width="52" height="52" /> : <UserCircle size={31} weight="duotone" />}</span><span className="profile-copy"><strong>Your profile</strong><small>{photo ? "Change profile picture" : "Add profile picture"}</small></span><Camera className="profile-camera" size={18} weight="duotone" aria-hidden="true" /></label>;
}

function Sidebar({ active, onNavigate, dark, onToggleDark, budgetSpent, monthlyBudget, profilePhoto, onProfilePhoto }) {
  const percent = monthlyBudget > 0 ? Math.round((budgetSpent / monthlyBudget) * 100) : 0;
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-block"><span className="brand-mark" aria-hidden="true"><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><span>Daily Expense Tracker</span></div></div>
      <ProfilePhotoControl photo={profilePhoto} onFile={onProfilePhoto} id="desktop-profile-photo" compact />
      <nav className="sidebar-nav">{NAV_ITEMS.map((item) => { const Icon = item.icon; return <button className={active === item.id ? "nav-item active" : "nav-item"} key={item.id} onClick={() => onNavigate(item.id)} aria-current={active === item.id ? "page" : undefined}><Icon size={21} weight={active === item.id ? "fill" : "regular"} /><span>{item.label}</span></button>; })}</nav>
      <div className="sidebar-foot"><div className="month-note"><span>{monthLabel(DISPLAY_MONTH)} budget</span><strong>{formatINR(budgetSpent)} spent</strong><small><TrendDown size={14} /> {percent}% of {formatINR(monthlyBudget)}</small></div><button className="theme-toggle" onClick={onToggleDark} aria-pressed={dark}><Moon size={19} /><span>Dark mode</span><i aria-hidden="true" /></button></div>
    </aside>
  );
}

function MobileNav({ active, onNavigate }) {
  const items = NAV_ITEMS.slice(0, 4);
  return <nav className="mobile-nav" aria-label="Mobile navigation">{items.map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onNavigate(item.id)}><Icon size={21} weight={active === item.id ? "fill" : "regular"} /><span>{item.label.replace(" & Ledgers", "")}</span></button>; })}</nav>;
}

function Header({ active, onAdd, onToggleMenu, menuOpen, user }) {
  const label = NAV_ITEMS.find((item) => item.id === active)?.label || "Dashboard";
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  const accountName = String(user?.name || "").trim();
  const userName = accountName || String(user?.email?.split("@")[0] || "there").trim();
  const heading = active === "dashboard" ? `${indiaGreeting(now)}, ${userName}` : label;
  return <header className="page-header"><button id="mobile-menu-trigger" className="mobile-menu" onClick={onToggleMenu} aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation-drawer"><List size={23} weight="bold" /></button><div><p>{titleCaseDate(indiaDateKey(now))} · IST</p><h1>{heading}</h1><span>{active === "dashboard" ? "A clear view of today, this month, and what comes next." : "Keep every rupee clear and accounted for."}</span></div><button className="primary-button header-add" onClick={onAdd}><Plus size={19} weight="bold" /> Log expense</button></header>;
}

function MobileMenuDrawer({ active, onNavigate, onClose, dark, onToggleDark, profilePhoto, onProfilePhoto }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("menu-open");
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.classList.remove("menu-open"); document.getElementById("mobile-menu-trigger")?.focus(); };
  }, [onClose]);
  return <div className="mobile-menu-drawer" id="mobile-navigation-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu"><button className="mobile-menu-backdrop" onClick={onClose} aria-label="Close navigation menu" /><aside className="mobile-menu-panel"><div className="mobile-menu-head"><div className="brand-block"><span className="brand-mark" aria-hidden="true"><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><span>Daily Expense Tracker</span></div></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close menu" autoFocus><X size={21} /></button></div><ProfilePhotoControl photo={profilePhoto} onFile={onProfilePhoto} id="mobile-profile-photo" /><nav aria-label="Mobile navigation">{NAV_ITEMS.map((item) => { const Icon = item.icon; return <button className={active === item.id ? "active" : ""} key={item.id} onClick={() => onNavigate(item.id)} aria-current={active === item.id ? "page" : undefined}><Icon size={21} weight={active === item.id ? "fill" : "regular"} /><span>{item.label}</span></button>; })}</nav><button type="button" className="menu-theme-toggle" onClick={onToggleDark} aria-pressed={dark}>{dark ? <Sun size={20} /> : <Moon size={20} />}<span><strong>{dark ? "Light theme" : "Dark theme"}</strong><small>Change appearance now</small></span><i aria-hidden="true" /></button><p>Account protected · securely synced</p></aside></div>;
}

function BudgetHero({ expenses, selectedMonth, onMonthChange, monthlyBudget, monthlyBudgets, advanceAccounts, creditAccounts }) {
  const monthExpenses = expensesForMonth(expenses, selectedMonth);
  const selectedBudget = getBudgetForMonth({ monthlyBudget, monthlyBudgets }, selectedMonth);
  const spent = monthExpenses.filter(isBudgetExpense).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const advanceUsage = ledgerUsageForMonth(expenses, advanceAccounts, selectedMonth, "advance");
  const creditUsage = ledgerUsageForMonth(expenses, creditAccounts, selectedMonth, "credit");
  const remaining = Math.max(selectedBudget - spent, 0);
  const used = selectedBudget > 0 ? Math.min((spent / selectedBudget) * 100, 100) : 0;
  const chart = [{ name: "Monthly budget", value: used, fill: spent > selectedBudget ? "#b65f5a" : "#52765b" }];
  return <section className="budget-hero-card" aria-labelledby="safe-title"><div className="budget-hero-head"><div><span className="eyebrow">Monthly budget</span><h2 id="safe-title">{monthLabel(selectedMonth)}</h2></div><MonthNavigator value={selectedMonth} onChange={onMonthChange} label="Dashboard budget month" /></div><div className="budget-hero-body"><div className="budget-primary"><span>Available to spend</span><strong>{formatINR(remaining)}</strong><small>{Math.round(used)}% used · {formatINR(selectedBudget)} total budget</small><div className="budget-mini-stats"><span><small>Spent</small><b>{formatINR(spent)}</b></span><span><small>Remaining</small><b>{formatINR(remaining)}</b></span></div></div><div className="budget-ring" aria-label={`${Math.round(used)} percent of monthly budget used`}><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="76%" outerRadius="100%" data={chart} startAngle={90} endAngle={-270} barSize={15}><PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /><RadialBar dataKey="value" background={{ fill: "var(--track)" }} cornerRadius={12} isAnimationActive={false} /></RadialBarChart></ResponsiveContainer><span><b>{Math.round(used)}%</b><small>used</small></span></div></div><div className="budget-ledger-strip"><div><HandCoins size={18} /><span>Advance usage<b>{formatINR(advanceUsage.used)} used</b><small>{formatINR(advanceUsage.defined)} advance defined</small></span></div><div><CreditCard size={18} /><span>Credit usage<b>{formatINR(creditUsage.used)} used</b><small>{formatINR(creditUsage.defined)} credit limit defined</small></span></div></div></section>;
}

function SpendingMix({ expenses, frequency }) {
  const totals = CATEGORY_LIBRARY[frequency].map((category) => ({ category, total: expenses.filter((e) => e.category === category).reduce((sum, e) => sum + Number(e.amount), 0) })).sort((a, b) => b.total - a.total);
  const cards = totals.slice(0, 4);
  const max = Math.max(...cards.map((item) => item.total), 1);
  return <section className="spending-mix-card" aria-labelledby="mix-title"><div className="section-heading"><div><span className="eyebrow">Spending mix</span><h2 id="mix-title">{FREQUENCY_LABELS[frequency]} essentials</h2><small>Top categories for this month</small></div><span className="mix-icon"><ShoppingBag size={21} weight="duotone" /></span></div><div className="mix-list">{cards.map((item, index) => <article key={item.category}><span className={`mix-rank tone-${index}`}>{index + 1}</span><div><span>{item.category}</span><progress max={max} value={item.total} aria-label={`${item.category}: ${formatINR(item.total)}`} /></div><strong>{item.total ? formatINR(item.total) : "—"}</strong></article>)}</div><p className="on-track"><Check size={17} weight="bold" /> Advance and Credit stay outside the monthly budget.</p></section>;
}

function TransactionRow({ expense, aliases, onEdit }) {
  const Icon = paymentIcon(expense.payment);
  return <button className="transaction-row" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.name}, ${formatINR(expense.amount)}`}><span className={`transaction-icon ${expense.color || "sage"}`}><Icon size={19} weight="duotone" /></span><span className="transaction-name"><strong>{expense.name}</strong><small>{expense.merchant || expense.category}</small></span><span className="transaction-payment"><Icon size={17} /> {aliases[expense.payment] || expense.payment}</span><span className="transaction-time"><b className={`frequency-badge ${expense.frequency}`}>{FREQUENCY_LABELS[expense.frequency]}</b><small>{expense.date === DISPLAY_DATE ? "Today" : expense.date}</small></span><strong className="transaction-amount">−{formatINR(expense.amount)}</strong><PencilSimple className="transaction-edit" size={16} /></button>;
}

function TransactionList({ expenses, aliases, onEdit, limit }) {
  const visible = limit ? expenses.slice(0, limit) : expenses;
  return <div className="transaction-list">{visible.length ? visible.map((expense) => <TransactionRow key={expense.id} expense={expense} aliases={aliases} onEdit={onEdit} />) : <div className="empty-state"><Receipt size={30} /><strong>No expenses found</strong><span>Try another filter or log a new expense.</span></div>}</div>;
}

function Dashboard({ expenses, aliases, frequency, monthlyBudget, monthlyBudgets, advanceAccounts, creditAccounts, onEdit, onViewAll }) {
  const [selectedMonth, setSelectedMonth] = useState(DISPLAY_MONTH);
  const selected = expensesForMonth(expenses, selectedMonth).filter((expense) => expense.frequency === frequency);
  return <div className="dashboard-grid"><BudgetHero expenses={expenses} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} monthlyBudget={monthlyBudget} monthlyBudgets={monthlyBudgets} advanceAccounts={advanceAccounts} creditAccounts={creditAccounts} /><SpendingMix expenses={selected} frequency={frequency} /><section className="recent-section"><div className="section-heading"><div><span className="eyebrow">Latest activity</span><h2>Recent {FREQUENCY_LABELS[frequency].toLowerCase()} transactions</h2></div><button className="text-button" onClick={onViewAll}>View all</button></div><TransactionList expenses={selected} aliases={aliases} onEdit={onEdit} limit={5} /></section></div>;
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

function BudgetView({ monthlyBudget, monthlyBudgets, expenses, advanceAccounts, creditAccounts, onBudgetChange, onAccountChange }) {
  const [selectedMonth, setSelectedMonth] = useState(DISPLAY_MONTH);
  const selectedBudget = getBudgetForMonth({ monthlyBudget, monthlyBudgets }, selectedMonth);
  const [budgetDraft, setBudgetDraft] = useState(String(selectedBudget));
  const monthExpenses = expensesForMonth(expenses, selectedMonth);
  const budgetSpent = monthExpenses.filter(isBudgetExpense).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const advanceUsage = ledgerUsageForMonth(expenses, advanceAccounts, selectedMonth, "advance");
  const creditUsage = ledgerUsageForMonth(expenses, creditAccounts, selectedMonth, "credit");
  const percent = selectedBudget > 0 ? Math.min(Math.round((budgetSpent / selectedBudget) * 100), 100) : 0;

  useEffect(() => setBudgetDraft(String(selectedBudget)), [selectedBudget, selectedMonth]);
  const submitBudget = (event) => { event.preventDefault(); onBudgetChange(selectedMonth, Math.max(Number(budgetDraft) || 0, 0)); };

  return <div className="budget-stack">
    <section className="module-card budget-view budget-summary">
      <div className="report-head"><div><span className="eyebrow">Budget history</span><h2>{monthLabel(selectedMonth)} budget</h2><p>Review any month without changing the ledger records underneath it.</p></div><MonthNavigator value={selectedMonth} onChange={setSelectedMonth} label="Budget month" /></div>
      <div className="module-intro budget-progress-head"><div><p>Daily, Weekly, Monthly and One-off spending counts toward this budget. Advance and Credit usage is shown separately.</p></div><strong>{percent}%</strong></div>
      <progress max="100" value={percent} className="master-progress" aria-label={`${percent}% of ${monthLabel(selectedMonth)} budget used`} />
      <div className="budget-kpis"><div><span>Budget</span><strong>{formatINR(selectedBudget)}</strong></div><div><span>Budget spend</span><strong>{formatINR(budgetSpent)}</strong></div><div><span>Remaining</span><strong className="positive">{formatINR(Math.max(selectedBudget - budgetSpent, 0))}</strong></div></div>
      {(advanceUsage.defined > 0 || advanceUsage.used > 0 || creditUsage.defined > 0 || creditUsage.used > 0) && <div className="special-usage-grid">
        {(advanceUsage.defined > 0 || advanceUsage.used > 0) && <article className="special-usage advance"><span><HandCoins size={20} /> Advance usage</span><strong>{formatINR(advanceUsage.used)}</strong><small>used in {monthLabel(selectedMonth)} · {formatINR(advanceUsage.defined)} advance defined</small><progress max={Math.max(advanceUsage.defined, advanceUsage.used, 1)} value={advanceUsage.used} aria-label={`Advance usage ${formatINR(advanceUsage.used)} of ${formatINR(advanceUsage.defined)}`} /></article>}
        {(creditUsage.defined > 0 || creditUsage.used > 0) && <article className="special-usage credit"><span><CreditCard size={20} /> Credit usage</span><strong>{formatINR(creditUsage.used)}</strong><small>used in {monthLabel(selectedMonth)} · {formatINR(creditUsage.defined)} credit limit defined</small><progress max={Math.max(creditUsage.defined, creditUsage.used, 1)} value={creditUsage.used} aria-label={`Credit usage ${formatINR(creditUsage.used)} of ${formatINR(creditUsage.defined)}`} /></article>}
      </div>}
      <form className="budget-form" action="#" onSubmit={submitBudget}><label htmlFor="monthly-budget"><span>{monthLabel(selectedMonth)} budget amount (₹)</span><input id="monthly-budget" name="monthly-budget" type="number" inputMode="decimal" min="0" max="1000000000" value={budgetDraft} onChange={(event) => setBudgetDraft(event.target.value)} required /></label><button className="primary-button" type="submit">Save budget</button></form>
    </section>
    <section className="module-card ledger-section"><div className="section-heading"><div><h2>Advance Payment 1–5</h2><small>Add each merchant and the advance amount already paid.</small></div><span className="outside-budget">Outside monthly budget</span></div><div className="ledger-grid">{advanceAccounts.map((account) => <AccountCard key={account.id} account={account} kind="advance" used={advanceUsage.rows.find((row) => row.id === account.id)?.used || 0} onChange={(accountPatch) => onAccountChange("advance", account.id, accountPatch)} />)}</div></section>
    <section className="module-card ledger-section"><div className="section-heading"><div><h2>Credit Borrow 1–5</h2><small>Add each merchant and set the maximum credit you allow.</small></div><span className="outside-budget">Outside monthly budget</span></div><div className="ledger-grid">{creditAccounts.map((account) => <AccountCard key={account.id} account={account} kind="credit" used={creditUsage.rows.find((row) => row.id === account.id)?.used || 0} onChange={(accountPatch) => onAccountChange("credit", account.id, accountPatch)} />)}</div></section>
  </div>;
}

function CategoriesView({ expenses, frequency, categoryConfig, onChange, onReset, onNotice }) {
  const groups = managedCategoryGroups(categoryConfig, frequency);
  const [expanded, setExpanded] = useState(() => new Set());
  const [newCategory, setNewCategory] = useState("");
  const [firstSubcategory, setFirstSubcategory] = useState("");
  const [subcategoryDrafts, setSubcategoryDrafts] = useState({});
  const activeGroups = groups.filter((group) => group.enabled).length;
  const activeSubcategories = groups.flatMap((group) => group.enabled ? group.subcategories.filter((item) => item.enabled) : []).length;
  const spendByGroup = Object.fromEntries(groups.map((group) => [group.name, expenses.filter((expense) => expense.frequency === frequency && expense.categoryGroup === group.name).reduce((sum, expense) => sum + Number(expense.amount), 0)]));
  const save = (nextGroups, message) => { onChange(nextGroups); if (message) onNotice(message); };
  const updateGroup = (groupId, updater, message) => save(groups.map((group) => group.id === groupId ? updater(group) : group), message);
  const moveGroup = (index, delta) => { const target = index + delta; if (target < 0 || target >= groups.length) return; const next = [...groups]; [next[index], next[target]] = [next[target], next[index]]; save(next, "Category position updated"); };
  const moveSubcategory = (groupId, index, delta) => updateGroup(groupId, (group) => { const target = index + delta; if (target < 0 || target >= group.subcategories.length) return group; const subcategories = [...group.subcategories]; [subcategories[index], subcategories[target]] = [subcategories[target], subcategories[index]]; return { ...group, subcategories }; }, "Sub-category position updated");
  const addCategory = (event) => {
    event.preventDefault();
    const name = newCategory.trim(); const subcategory = firstSubcategory.trim();
    if (!name || !subcategory) return onNotice("Enter both a category and its first sub-category");
    if (groups.some((group) => group.name.toLocaleLowerCase("en-IN") === name.toLocaleLowerCase("en-IN"))) return onNotice("That category already exists");
    save([...groups, { id: crypto.randomUUID(), name, enabled: true, custom: true, subcategories: [{ id: crypto.randomUUID(), name: subcategory, enabled: true, custom: true }] }], `${name} added to ${FREQUENCY_LABELS[frequency]}`);
    setNewCategory(""); setFirstSubcategory("");
  };
  const addSubcategory = (event, group) => {
    event.preventDefault();
    const name = String(subcategoryDrafts[group.id] || "").trim();
    if (!name) return onNotice("Enter a sub-category name");
    if (group.subcategories.some((item) => item.name.toLocaleLowerCase("en-IN") === name.toLocaleLowerCase("en-IN"))) return onNotice("That sub-category already exists here");
    updateGroup(group.id, (current) => ({ ...current, subcategories: [...current.subcategories, { id: crypto.randomUUID(), name, enabled: true, custom: true }] }), `${name} added`);
    setSubcategoryDrafts((current) => ({ ...current, [group.id]: "" }));
  };
  const toggleExpanded = (id) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return <div className="category-studio">
    <section className="module-card category-studio-hero"><div><span className="eyebrow">Category studio</span><h2>Shape your {FREQUENCY_LABELS[frequency].toLowerCase()} expense flow</h2><p>Enable only what you use, arrange it in the order you prefer, and add categories unique to your household.</p></div><div className="category-stats"><span><strong>{activeGroups}</strong> active categories</span><span><strong>{activeSubcategories}</strong> active sub-categories</span></div></section>
    <section className="module-card custom-category-card"><div className="category-header"><div><h2>Add your own category</h2><p className="module-subtitle">It will be available only under {FREQUENCY_LABELS[frequency]} expenses.</p></div><button type="button" className="text-button" onClick={onReset}>Restore default order</button></div><form action="#" onSubmit={addCategory}><label htmlFor="new-category"><span>Category name</span><input id="new-category" name="new-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} maxLength="100" required /></label><label htmlFor="new-first-subcategory"><span>First sub-category</span><input id="new-first-subcategory" name="new-first-subcategory" value={firstSubcategory} onChange={(event) => setFirstSubcategory(event.target.value)} maxLength="120" required /></label><button className="primary-button" type="submit"><Plus size={18} weight="bold" /> Add category</button></form></section>
    <section className="module-card managed-category-list"><div className="category-header"><div><h2>Manage categories & order</h2><p className="module-subtitle">Move controls work with touch, mouse and keyboard. Disabled items remain on past transactions.</p></div><strong>{groups.length} categories</strong></div><div className="managed-groups">{groups.map((group, groupIndex) => { const isOpen = expanded.has(group.id); return <article className={group.enabled ? "managed-group" : "managed-group disabled"} key={group.id}><div className="managed-group-head"><button type="button" className="group-disclosure" onClick={() => toggleExpanded(group.id)} aria-expanded={isOpen} aria-controls={`category-${group.id}`}><span className="managed-icon"><Tag size={19} weight="duotone" /></span><span><strong>{group.name}</strong><small>{group.subcategories.filter((item) => item.enabled).length} active · {formatINR(spendByGroup[group.name] || 0)} tracked</small></span><CaretDown size={18} aria-hidden="true" /></button><div className="reorder-controls" aria-label={`Arrange ${group.name}`}><button type="button" onClick={() => moveGroup(groupIndex, -1)} aria-label={`Move ${group.name} up`} aria-disabled={groupIndex === 0}><CaretUp size={17} /></button><button type="button" onClick={() => moveGroup(groupIndex, 1)} aria-label={`Move ${group.name} down`} aria-disabled={groupIndex === groups.length - 1}><CaretDown size={17} /></button><button type="button" className={group.enabled ? "enable-button active" : "enable-button"} onClick={() => updateGroup(group.id, (current) => ({ ...current, enabled: !current.enabled }), `${group.name} ${group.enabled ? "disabled" : "enabled"}`)} aria-pressed={group.enabled}>{group.enabled ? <Check size={17} weight="bold" /> : <X size={17} />}<span>{group.enabled ? "Enabled" : "Disabled"}</span></button></div></div>{isOpen && <div className="managed-subcategories" id={`category-${group.id}`}><div className="subcategory-list">{group.subcategories.map((item, index) => <div className={item.enabled ? "managed-subcategory" : "managed-subcategory disabled"} key={item.id}><span>{item.name}</span><div className="reorder-controls" aria-label={`Arrange ${item.name}`}><button type="button" onClick={() => moveSubcategory(group.id, index, -1)} aria-label={`Move ${item.name} up`} aria-disabled={index === 0}><CaretUp size={16} /></button><button type="button" onClick={() => moveSubcategory(group.id, index, 1)} aria-label={`Move ${item.name} down`} aria-disabled={index === group.subcategories.length - 1}><CaretDown size={16} /></button><button type="button" className={item.enabled ? "mini-enable active" : "mini-enable"} onClick={() => updateGroup(group.id, (current) => ({ ...current, subcategories: current.subcategories.map((subcategory) => subcategory.id === item.id ? { ...subcategory, enabled: !subcategory.enabled } : subcategory) }), `${item.name} ${item.enabled ? "disabled" : "enabled"}`)} aria-pressed={item.enabled}>{item.enabled ? "On" : "Off"}</button></div></div>)}</div><form action="#" className="add-subcategory-form" onSubmit={(event) => addSubcategory(event, group)}><label htmlFor={`new-subcategory-${group.id}`}><span>Add a sub-category to {group.name}</span><input id={`new-subcategory-${group.id}`} name={`new-subcategory-${group.id}`} value={subcategoryDrafts[group.id] || ""} onChange={(event) => setSubcategoryDrafts((current) => ({ ...current, [group.id]: event.target.value }))} maxLength="120" required /></label><button type="submit" className="secondary-button"><Plus size={17} /> Add</button></form></div>}</article>; })}</div></section>
  </div>;
}

function ReportsView({ expenses, aliases, monthlyBudget, monthlyBudgets, analyticsModules, onModulesChange, onEdit }) {
  const [selectedMonth, setSelectedMonth] = useState(DISPLAY_MONTH);
  const [frequency, setFrequency] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const monthExpenses = expensesForMonth(expenses, selectedMonth);
  const scoped = monthExpenses.filter((expense) => frequency === "all" || expense.frequency === frequency);
  const total = scoped.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const budgetTotal = scoped.filter(isBudgetExpense).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const specialTotal = total - budgetTotal;
  const selectedBudget = getBudgetForMonth({ monthlyBudget, monthlyBudgets }, selectedMonth);
  const methodRows = Object.entries(scoped.reduce((groups, expense) => { const row = groups[expense.payment] || { total: 0, count: 0 }; groups[expense.payment] = { total: row.total + Number(expense.amount), count: row.count + 1 }; return groups; }, {})).map(([id, values]) => ({ id, ...values, share: total > 0 ? Math.round((values.total / total) * 100) : 0 })).sort((a, b) => b.total - a.total);
  const activeMethod = selectedMethod && methodRows.some((row) => row.id === selectedMethod) ? selectedMethod : methodRows[0]?.id;
  const drilldown = scoped.filter((expense) => expense.payment === activeMethod);
  const selectedRow = methodRows.find((row) => row.id === activeMethod);
  const previousMonth = shiftMonthKey(selectedMonth, -1);
  const previousTotal = expensesForMonth(expenses, previousMonth).filter((expense) => frequency === "all" || expense.frequency === frequency).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const monthChange = previousTotal > 0 ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const rawPieData = methodRows.map((row) => ({ name: aliases[row.id] || row.id, value: row.total }));
  const pieData = rawPieData.length > 6 ? [...rawPieData.slice(0, 5), { name: "Other methods", value: rawPieData.slice(5).reduce((sum, item) => sum + item.value, 0) }] : rawPieData;
  const categoryData = Object.values(scoped.reduce((groups, expense) => { groups[expense.category] = { name: expense.category, amount: (groups[expense.category]?.amount || 0) + Number(expense.amount) }; return groups; }, {})).sort((a, b) => b.amount - a.amount).slice(0, 8);
  const [selectedYear, selectedMonthNumber] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(selectedYear, selectedMonthNumber, 0).getDate();
  const trendData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    const daily = scoped.filter((expense) => expense.date === `${selectedMonth}-${day}`);
    return {
      day: index + 1,
      "Budget spend": daily.filter(isBudgetExpense).reduce((sum, expense) => sum + Number(expense.amount), 0),
      "Advance + Credit": daily.filter((expense) => !isBudgetExpense(expense)).reduce((sum, expense) => sum + Number(expense.amount), 0),
    };
  });
  const hasTrend = trendData.some((item) => item["Budget spend"] || item["Advance + Credit"]);
  const modules = { ...DEFAULT_ANALYTICS_MODULES, ...(analyticsModules || {}) };
  const enabledModuleCount = Object.values(modules).filter(Boolean).length;
  const topCategory = categoryData[0];
  const topMethod = methodRows[0];
  const busiestDay = trendData.reduce((best, item) => (item["Budget spend"] + item["Advance + Credit"]) > (best["Budget spend"] + best["Advance + Credit"]) ? item : best, trendData[0] || { day: 1, "Budget spend": 0, "Advance + Credit": 0 });
  const budgetUse = selectedBudget > 0 ? Math.round((budgetTotal / selectedBudget) * 100) : null;
  const aiInsights = total > 0 ? [
    { label: "Budget signal", title: budgetUse === null ? "Set a monthly budget for a sharper forecast" : budgetUse > 100 ? `Spending is ${budgetUse - 100}% above budget` : `${Math.max(100 - budgetUse, 0)}% of budget remains`, detail: budgetUse === null ? "Your spending is tracked, but a budget unlocks pacing guidance." : `${formatINR(budgetTotal)} used from ${formatINR(selectedBudget)} for this view.`, tone: budgetUse !== null && budgetUse > 100 ? "alert" : "positive" },
    { label: "Largest driver", title: topCategory ? `${topCategory.name} leads this period` : "No category concentration", detail: topCategory ? `${formatINR(topCategory.amount)} across the selected month and frequency.` : "Add more transactions to identify a spending driver.", tone: "focus" },
    { label: "Payment behaviour", title: topMethod ? `${aliases[topMethod.id] || topMethod.id} is used most` : "No payment pattern yet", detail: topMethod ? `${topMethod.count} transactions representing ${topMethod.share}% of analysed spending.` : "A pattern will appear as transactions are logged.", tone: "calm" },
    { label: "Timing pattern", title: `Day ${busiestDay.day} had the highest activity`, detail: `${formatINR(busiestDay["Budget spend"] + busiestDay["Advance + Credit"])} was recorded on that day.`, tone: "focus" },
  ] : [{ label: "Ready when you are", title: "No spending to analyse yet", detail: "Log an expense in this month and the analysis will identify budget, category, payment and timing patterns.", tone: "calm" }];
  const exportCsv = () => { const safe = (value) => { const text = String(value ?? "").replaceAll('"', '""'); return /^[=+\-@]/.test(text) ? `'${text}` : text; }; const rows = [["Date", "Frequency", "Expense", "Merchant", "Category", "Payment", "Budget treatment", "Amount"], ...scoped.map((e) => [e.date, FREQUENCY_LABELS[e.frequency], e.name, e.merchant, e.category, aliases[e.payment], paymentClass(e.payment), e.amount])]; const csv = rows.map((row) => row.map((cell) => `"${safe(cell)}"`).join(",")).join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = `pocket-ledger-${selectedMonth}-analysis.csv`; link.click(); URL.revokeObjectURL(url); };

  return <div className="analytics-stack"><section className="module-card reports-view">
    <div className="report-head"><div><span className="eyebrow">Advanced analytics</span><h2>{monthLabel(selectedMonth)} spending</h2><p>Change the month to compare historical payment, category and daily trends.</p></div><div className="report-actions"><MonthNavigator value={selectedMonth} onChange={(nextMonth) => { setSelectedMonth(nextMonth); setSelectedMethod(null); }} label="Analytics month" /><button className="secondary-button" onClick={exportCsv}><DownloadSimple size={18} /> Export CSV</button></div></div>
    <FrequencyTabs value={frequency} onChange={(nextFrequency) => { setFrequency(nextFrequency); setSelectedMethod(null); }} includeAll label="Analytics frequency" />
    <div className="analytics-module-picker"><div><span className="eyebrow">Your analytics canvas</span><strong>Choose chart modules</strong><small>Show only the visualisations you need. Your choice syncs across devices.</small></div><div role="group" aria-label="Visible analytics chart modules">{[["pie", "Pie chart", ChartDonut], ["bar", "Bar chart", ChartBar], ["trend", "Trend chart", TrendDown]].map(([id, label, Icon]) => <button type="button" key={id} className={modules[id] ? "active" : ""} onClick={() => onModulesChange({ ...modules, [id]: !modules[id] })} aria-pressed={modules[id]}><Icon size={18} /><span>{label}</span>{modules[id] && <Check size={15} weight="bold" />}</button>)}</div></div>
    <div className="report-stats four"><div><span>Total analysed</span><strong>{formatINR(total)}</strong></div><div><span>Budget spend</span><strong>{formatINR(budgetTotal)}</strong></div><div><span>Advance + Credit</span><strong>{formatINR(specialTotal)}</strong></div><div><span>vs {monthLabel(previousMonth)}</span><strong className={monthChange !== null && monthChange <= 0 ? "positive" : ""}>{monthChange === null ? "No baseline" : `${monthChange > 0 ? "+" : ""}${monthChange}%`}</strong></div></div>

    <section className="ai-analysis-card" aria-labelledby="ai-analysis-title"><div className="ai-analysis-head"><span className="ai-orb"><Sparkle size={23} weight="fill" /></span><div><span className="eyebrow">Private intelligence</span><h3 id="ai-analysis-title">AI Analysis</h3><p>On-device insight engine · only aggregated totals are analysed · nothing is sent outside Pocket Ledger.</p></div><span className="analysis-confidence">{scoped.length >= 10 ? "Strong signal" : scoped.length ? "Early signal" : "Awaiting data"}</span></div><div className="ai-insight-grid">{aiInsights.map((insight) => <article className={`ai-insight ${insight.tone}`} key={insight.label}><span>{insight.label}</span><strong>{insight.title}</strong><p>{insight.detail}</p></article>)}</div><p className="ai-disclaimer">Analysis highlights patterns, not financial advice. Review your transactions before making decisions.</p></section>

    <div className={`chart-grid visible-${enabledModuleCount}`}>
      {modules.pie && <article className="chart-card"><div className="chart-heading"><div><span>Pie chart</span><h3>Payment method mix</h3></div><strong>{methodRows.length} methods</strong></div>{pieData.length ? <><div className="chart-canvas" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="78%" paddingAngle={2} isAnimationActive={false}>{pieData.map((item, index) => <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><Tooltip content={<CurrencyTooltip />} /></PieChart></ResponsiveContainer></div><div className="chart-legend">{pieData.map((item, index) => <span key={item.name}><i className={`chart-swatch tone-${index % CHART_COLORS.length}`} />{item.name}<b>{formatINR(item.value)}</b></span>)}</div><AccessibleDataTable caption={`${monthLabel(selectedMonth)} payment method totals`} columns={["Payment method", "Amount"]} rows={pieData.map((item) => [item.name, formatINR(item.value)])} /></> : <div className="chart-empty">No payment activity in this month.</div>}</article>}
      {modules.bar && <article className="chart-card"><div className="chart-heading"><div><span>Bar chart</span><h3>Top spending categories</h3></div><strong>{categoryData.length} shown</strong></div>{categoryData.length ? <><div className="chart-canvas" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 6 }}><CartesianGrid stroke="var(--chart-grid)" horizontal={false} /><XAxis type="number" tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} tick={{ fill: "var(--muted)", fontSize: 11 }} /><YAxis type="category" dataKey="name" width={92} tick={{ fill: "var(--muted)", fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip content={<CurrencyTooltip />} /><Bar dataKey="amount" name="Spend" fill="var(--sage)" radius={[0, 6, 6, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div><AccessibleDataTable caption={`${monthLabel(selectedMonth)} category totals`} columns={["Category", "Amount"]} rows={categoryData.map((item) => [item.name, formatINR(item.amount)])} /></> : <div className="chart-empty">No category activity in this month.</div>}</article>}
      {modules.trend && <article className="chart-card trend-card"><div className="chart-heading"><div><span>Trend chart</span><h3>Daily spending movement</h3></div><div className="trend-legend"><span><i className="chart-swatch tone-0" /> Budget spend</span><span><i className="chart-swatch tone-3" /> Advance + Credit</span></div></div>{hasTrend ? <><div className="chart-canvas trend" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData} margin={{ top: 8, right: 16, bottom: 2, left: 0 }}><CartesianGrid stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 10 }} interval={Math.max(Math.ceil(daysInMonth / 8) - 1, 0)} /><YAxis tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} tick={{ fill: "var(--muted)", fontSize: 10 }} width={45} /><Tooltip content={<CurrencyTooltip />} /><Line type="monotone" dataKey="Budget spend" stroke="var(--sage)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} /><Line type="monotone" dataKey="Advance + Credit" stroke="var(--plum)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} /></LineChart></ResponsiveContainer></div><AccessibleDataTable caption={`${monthLabel(selectedMonth)} daily spending trend`} columns={["Day", "Budget spend", "Advance and Credit"]} rows={trendData.map((item) => [item.day, formatINR(item["Budget spend"]), formatINR(item["Advance + Credit"])])} /></> : <div className="chart-empty">No daily trend is available for this month.</div>}</article>}
      {!enabledModuleCount && <div className="chart-empty modules-empty"><ChartBar size={30} /><strong>No chart modules selected</strong><span>Choose Pie, Bar or Trend above to rebuild your analytics canvas.</span></div>}
    </div>

    <div className="analytics-grid"><div className="method-analysis"><div className="analysis-table-head"><span>Payment mode</span><span>Transactions</span><span>Share</span><span>Total</span></div>{methodRows.length ? methodRows.map((row) => { const Icon = paymentIcon(row.id); return <button key={row.id} className={activeMethod === row.id ? "method-row active" : "method-row"} onClick={() => setSelectedMethod(row.id)}><span><Icon size={18} /> <b>{aliases[row.id]}</b><small>{paymentClass(row.id)}</small></span><span>{row.count}</span><span>{row.share}%</span><strong>{formatINR(row.total)}</strong><i style={{ "--share": `${row.share}%` }} /></button>; }) : <div className="chart-empty compact">No payment methods to drill into.</div>}</div><div className="drilldown-panel"><div><span>Selected payment mode</span><h3>{aliases[activeMethod] || "No activity"}</h3>{selectedRow && <p>{selectedRow.count} transactions · {selectedRow.share}% of analysed spend</p>}</div><TransactionList expenses={drilldown} aliases={aliases} onEdit={onEdit} /></div></div>
  </section></div>;
}

function SettingsView({ appearance, onAppearanceChange, onReset, installAvailable, installed, onInstall }) {
  const modes = [["light", "Light"], ["dark", "Dark"], ["system", "Device"]];
  const palettes = [["heritage", "Heritage"], ["indigo", "Indigo"], ["ocean", "Ocean"], ["forest", "Forest"], ["rose", "Rose"]];
  return <section className="module-card settings-view"><div className="pwa-install-card"><div className="pwa-icon"><Wallet size={24} weight="fill" /></div><div><strong>{installed ? "Pocket Ledger is installed" : "Install Pocket Ledger"}</strong><span>{installed ? "It can now launch from your home screen in its own app window." : installAvailable ? "Add it to this device for a standalone, offline-capable experience." : "On iPhone, use Share → Add to Home Screen. On Android, use the browser’s Install app option."}</span></div>{!installed && <button className="primary-button" type="button" onClick={onInstall}><DownloadSimple size={18} /> Install app</button>}</div><div className="appearance-settings"><div className="settings-heading"><span className="eyebrow">Personalise</span><h2>Appearance</h2><p>Choose the theme, colour palette and surface style used across the website and installed app.</p></div><fieldset><legend>Theme</legend><div className="segmented-setting">{modes.map(([id, label]) => <button type="button" key={id} className={appearance.mode === id ? "active" : ""} onClick={() => onAppearanceChange({ mode: id })} aria-pressed={appearance.mode === id}>{id === "dark" ? <Moon size={18} /> : id === "light" ? <Sun size={18} /> : <GearSix size={18} />}{label}</button>)}</div></fieldset><fieldset><legend>Colour palette</legend><div className="palette-options">{palettes.map(([id, label]) => <button type="button" key={id} className={appearance.palette === id ? "active" : ""} onClick={() => onAppearanceChange({ palette: id })} aria-pressed={appearance.palette === id}><i className={`palette-swatch ${id}`} aria-hidden="true" /><span>{label}</span>{appearance.palette === id && <Check size={17} weight="bold" aria-hidden="true" />}</button>)}</div></fieldset><fieldset><legend>Look</legend><div className="look-options"><button type="button" className={appearance.look === "soft" ? "active" : ""} onClick={() => onAppearanceChange({ look: "soft" })} aria-pressed={appearance.look === "soft"}><strong>Soft heritage</strong><span>Rounded cards, gentle shadows and depth.</span></button><button type="button" className={appearance.look === "crisp" ? "active" : ""} onClick={() => onAppearanceChange({ look: "crisp" })} aria-pressed={appearance.look === "crisp"}><strong>Clean & crisp</strong><span>Sharper cards, lighter shadows and compact surfaces.</span></button></div></fieldset></div><div className="settings-section"><h2>Data model</h2><p>Daily, Weekly, Monthly and One-off expenses are stored in your account-backed ledger. Monthly budget totals exclude Advance Payment and Credit Borrow entries. Merchant ledgers can be configured under Budget & Ledgers.</p></div><div className="danger-zone"><div><strong>Reset demo data</strong><span>Restore the original sample expenses, monthly budget and merchant ledgers.</span></div><button className="danger-button" onClick={onReset}><ArrowsClockwise size={17} /> Reset</button></div></section>;
}

function AddExpenseDrawer({ expense, aliases, defaultFrequency, initialDate = DISPLAY_DATE, defaultStatus = "actual", requiresDisclaimers = false, monthlyBudget, monthlyBudgets, advanceAccounts, creditAccounts, categoryConfig, allExpenses, onClose, onSave, onDelete }) {
  const editing = Boolean(expense);
  const [form, setForm] = useState(() => { const firstGroup = activeCategoryGroups(categoryConfig, defaultFrequency)[0]; const firstSubcategory = firstGroup.subcategories[0].name; return expense || { amount: "", name: "", merchant: "", categoryGroup: firstGroup.name, category: firstSubcategory, subcategory: firstSubcategory, frequency: defaultFrequency, date: initialDate, time: "12:00", payment: "cash", status: defaultStatus, planNote: "", reminder: "both" }; });
  const [errors, setErrors] = useState({});
  const [acknowledged, setAcknowledged] = useState([false, false, false]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const availableGroups = activeCategoryGroups(categoryConfig, form.frequency);
  const selectableGroups = availableGroups.some((group) => group.name === form.categoryGroup) ? availableGroups : [...availableGroups, { id: "existing-category", name: form.categoryGroup, subcategories: [{ id: "existing-subcategory", name: form.category, enabled: true }] }];
  const changeFrequency = (nextFrequency) => { const firstGroup = activeCategoryGroups(categoryConfig, nextFrequency)[0]; const firstSubcategory = firstGroup.subcategories[0].name; setForm((current) => ({ ...current, frequency: nextFrequency, categoryGroup: firstGroup.name, category: firstSubcategory, subcategory: firstSubcategory })); };
  const changeCategoryGroup = (nextGroup) => { const firstSubcategory = selectableGroups.find((group) => group.name === nextGroup)?.subcategories[0]?.name || CATEGORY_LIBRARY[form.frequency][0]; setForm((current) => ({ ...current, categoryGroup: nextGroup, category: firstSubcategory, subcategory: firstSubcategory })); };
  const subcategories = selectableGroups.find((group) => group.name === form.categoryGroup)?.subcategories || [];
  const selectedAdvance = advanceAccounts.find((account) => account.id === form.payment);
  const selectedCredit = creditAccounts.find((account) => account.id === form.payment);
  const isFuture = form.date > DISPLAY_DATE;
  const formMonth = /^\d{4}-\d{2}/.test(form.date) ? form.date.slice(0, 7) : DISPLAY_MONTH;
  const targetBudget = getBudgetForMonth({ monthlyBudget, monthlyBudgets }, formMonth);
  const baseBudgetSpent = allExpenses.filter((item) => item.id !== expense?.id && String(item.date).startsWith(formMonth) && isBudgetExpense(item)).reduce((sum, item) => sum + Number(item.amount), 0);
  const projectedBudgetSpent = baseBudgetSpent + (isBudgetExpense(form) && !isFuture ? Number(form.amount) || 0 : 0);
  const ledgerUsed = (payment) => allExpenses.filter((item) => item.payment === payment && item.id !== expense?.id).reduce((sum, item) => sum + Number(item.amount), 0) + (Number(form.amount) || 0);
  const submit = (event) => { event.preventDefault(); const nextErrors = {}; if (!Number(form.amount) || Number(form.amount) <= 0) nextErrors.amount = "Enter an amount greater than zero."; if (Number(form.amount) > 10000000) nextErrors.amount = "Amount must be below ₹1,00,00,000."; if (!form.payment) nextErrors.payment = "Choose a payment method."; if (editing && requiresDisclaimers && acknowledged.some((value) => !value)) nextErrors.disclaimers = "Please acknowledge all three edit notices before saving."; setErrors(nextErrors); if (Object.keys(nextErrors).length) return; onSave({ ...form, amount: Number(form.amount), name: form.name.trim() || form.category, merchant: form.merchant.trim(), categoryGroup: form.categoryGroup || categoryGroupFor(form.frequency, form.category), category: form.category, subcategory: form.category, status: isFuture ? "planned" : "actual", planNote: isFuture ? (form.planNote || "").trim() : "", reminder: isFuture ? (form.reminder || "both") : "none", id: form.id || crypto.randomUUID(), color: form.color || "sage" }); };
  useEffect(() => { const closeOnEscape = (event) => event.key === "Escape" && onClose(); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [onClose]);
  let impact = <><span>{monthLabel(formMonth)} budget after this expense</span><strong>{formatINR(projectedBudgetSpent)} used <b>{formatINR(Math.max(targetBudget - projectedBudgetSpent, 0))} left</b></strong></>;
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
          <div className="form-step"><div><strong>Classify the Spending</strong><small>Choose the broad category first, then the specific sub-category.</small></div></div>
          <div className="form-grid two-col ordered-fields">
            <label htmlFor="expense-category-group"><span>Category</span><select id="expense-category-group" name="category-group" value={form.categoryGroup} onChange={(event) => changeCategoryGroup(event.target.value)} autoFocus>{selectableGroups.map((group) => <option value={group.name} key={group.id}>{group.name}</option>)}</select></label>
            <label htmlFor="expense-category"><span>Sub-category</span><select id="expense-category" name="subcategory" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value, subcategory: event.target.value }))}>{subcategories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
          </div>
          <div className="form-step"><div><strong>Add the Expense Details</strong><small>Only the amount and date are required.</small></div></div>
          <div className="amount-field"><label htmlFor="expense-amount"><span>Amount (₹)</span><input id="expense-amount" name="amount" inputMode="decimal" type="number" min="1" max="10000000" value={form.amount} onChange={(event) => set("amount", event.target.value)} aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? "amount-error" : "quick-amount-hint"} required />{errors.amount && <small id="amount-error" className="field-error">{errors.amount}</small>}</label><div className="quick-amounts" role="group" aria-label={`Quick amounts for ${FREQUENCY_LABELS[form.frequency]} expenses`}><small id="quick-amount-hint">Quick amount</small>{QUICK_AMOUNTS[form.frequency].map((amount) => <button type="button" key={amount} className={Number(form.amount) === amount ? "active" : ""} onClick={() => set("amount", String(amount))} aria-pressed={Number(form.amount) === amount}>{amount >= 1000 ? `₹${amount / 1000}k` : `₹${amount}`}</button>)}</div></div>
          <label htmlFor="expense-name"><span>Expense name <small>Optional</small></span><input id="expense-name" name="expense-name" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder={`Defaults to ${form.category}`} maxLength="60" /></label>
          <label htmlFor="expense-date"><span>Date</span><input id="expense-date" name="date" type="date" value={form.date} onChange={(event) => set("date", event.target.value)} required /><small className="field-hint">Today is {titleCaseDate(DISPLAY_DATE)}. Future dates are saved as planned expenses.</small></label>
          <label htmlFor="expense-payment"><span>Payment method / mode</span><select id="expense-payment" name="payment" value={form.payment} onChange={(event) => set("payment", event.target.value)} required>{PAYMENT_GROUPS.map((group) => <optgroup label={group.label} key={group.label}>{group.options.map(([id]) => <option value={id} key={id}>{aliases[id]}</option>)}</optgroup>)}</select>{errors.payment && <small className="field-error">{errors.payment}</small>}</label>
          <details className="optional-details"><summary>Merchant and optional details</summary><label htmlFor="expense-merchant"><span>Merchant / shop <small>Optional</small></span><input id="expense-merchant" name="merchant" value={form.merchant} onChange={(event) => set("merchant", event.target.value)} placeholder="e.g. neighbourhood store" maxLength="80" /></label></details>
          {isFuture && <fieldset className="planned-fields"><legend>Planned expense reminder</legend><label htmlFor="plan-note"><span>Reminder note</span><textarea id="plan-note" name="plan-note" value={form.planNote || ""} onChange={(event) => set("planNote", event.target.value)} placeholder="What should you check or prepare before this expense?" maxLength="240" rows="3" /></label><label htmlFor="plan-reminder"><span>Notify me inside Ledger</span><select id="plan-reminder" name="reminder" value={form.reminder || "both"} onChange={(event) => set("reminder", event.target.value)}><option value="both">One month before and one week before</option><option value="month">One month before</option><option value="week">One week before</option><option value="none">No reminder</option></select></label></fieldset>}
          <div className={`impact-note ${selectedAdvance || selectedCredit || isFuture ? "special" : ""}`}>{impact}</div>
          {editing && requiresDisclaimers && <fieldset className="edit-disclaimers" aria-describedby={errors.disclaimers ? "disclaimer-error" : undefined}><legend>Before saving, acknowledge all 3 notices</legend>{editNotices.map((notice, index) => <label key={notice}><input type="checkbox" name={`edit-notice-${index + 1}`} checked={acknowledged[index]} onChange={(event) => setAcknowledged((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /><span>{index + 1}. {notice}</span></label>)}{errors.disclaimers && <small id="disclaimer-error" className="field-error" role="alert">{errors.disclaimers}</small>}</fieldset>}
          <div className="drawer-actions">{editing && <button type="button" className="delete-button" onClick={() => onDelete(expense.id)}><Trash size={17} /> Delete</button>}<button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={18} weight="bold" /> {editing ? "Save and archive old" : isFuture ? "Save planned expense" : "Save expense"}</button></div>
        </form>
      </aside>
    </div>
  );
}

function LedgerApp({ initialState, user }) {
  const [saved, setSaved] = useState(() => initialState);
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [active, setActive] = useState(() => { const requested = initialParams.get("view") === "calendar" ? "ledger" : initialParams.get("view"); return NAV_ITEMS.some((item) => item.id === requested) ? requested : "dashboard"; });
  const [frequency, setFrequency] = useState(() => FREQUENCIES.some((item) => item.id === initialParams.get("frequency")) ? initialParams.get("frequency") : "daily");
  const [drawer, setDrawer] = useState(() => { const requestedExpense = saved.expenses.find((item) => item.id === initialParams.get("edit")) || null; return { open: initialParams.get("drawer") === "1" || Boolean(requestedExpense), expense: requestedExpense, initialDate: requestedExpense?.date || (/^\d{4}-\d{2}-\d{2}$/.test(initialParams.get("date") || "") ? initialParams.get("date") : DISPLAY_DATE), defaultStatus: requestedExpense?.status || (initialParams.get("planned") === "1" ? "planned" : "actual"), requiresDisclaimers: Boolean(requestedExpense) && initialParams.get("source") === "ledger" }; });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const records = useMemo(() => [...saved.expenses].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)), [saved.expenses]);
  const expenses = useMemo(() => records.filter((record) => record.status !== "planned"), [records]);
  const aliases = useMemo(() => buildAliases(saved), [saved]);
  const budgetSpent = useMemo(() => expenses.filter((expense) => isDisplayMonth(expense) && isBudgetExpense(expense)).reduce((sum, expense) => sum + Number(expense.amount), 0), [expenses]);
  const currentBudget = getBudgetForMonth(saved, DISPLAY_MONTH);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/state", { method: "PUT", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(saved) });
        if (!response.ok) throw new Error("Cloud save failed");
      } catch { setToast("Could not sync changes. Check your connection."); }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [saved]);
  const appearance = saved.appearance || { ...APPEARANCE_DEFAULTS, mode: saved.dark ? "dark" : "light" };
  const dark = appearance.mode === "system" ? systemDark : appearance.mode === "dark";
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; document.documentElement.dataset.palette = appearance.palette; document.documentElement.dataset.look = appearance.look; }, [dark, appearance.palette, appearance.look]);
  useEffect(() => { const query = window.matchMedia("(prefers-color-scheme: dark)"); const update = (event) => setSystemDark(event.matches); query.addEventListener?.("change", update); return () => query.removeEventListener?.("change", update); }, []);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2600); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const captureInstall = (event) => { event.preventDefault(); setInstallPrompt(event); }; const markInstalled = () => { setInstalled(true); setInstallPrompt(null); }; window.addEventListener("beforeinstallprompt", captureInstall); window.addEventListener("appinstalled", markInstalled); return () => { window.removeEventListener("beforeinstallprompt", captureInstall); window.removeEventListener("appinstalled", markInstalled); }; }, []);

  const closeDrawer = () => setDrawer({ open: false, expense: null, initialDate: DISPLAY_DATE, defaultStatus: "actual", requiresDisclaimers: false });
  const openNew = () => setDrawer({ open: true, expense: null, initialDate: DISPLAY_DATE, defaultStatus: "actual", requiresDisclaimers: false });
  const openLedgerDate = (date, planned) => setDrawer({ open: true, expense: null, initialDate: date, defaultStatus: planned ? "planned" : "actual", requiresDisclaimers: false });
  const openEdit = (expense, fromLedger = false) => { setFrequency(expense.frequency); setDrawer({ open: true, expense, initialDate: expense.date, defaultStatus: expense.status || "actual", requiresDisclaimers: fromLedger }); };
  const saveExpense = (nextExpense) => { setSaved((current) => upsertExpenseWithArchive(current, nextExpense)); closeDrawer(); setToast(drawer.expense ? "Expense updated · old value archived" : nextExpense.status === "planned" ? "Planned expense saved" : "Expense added"); };
  const deleteExpense = (id) => { setSaved((current) => deleteExpenseWithArchive(current, id)); closeDrawer(); setToast("Expense deleted · old value archived"); };
  const transitionUpdate = (update) => { if (document.startViewTransition) document.startViewTransition(() => flushSync(update)); else update(); };
  const navigate = (id) => transitionUpdate(() => { setActive(id); setMobileMenu(false); });
  const navigateFrequency = (nextFrequency) => transitionUpdate(() => setFrequency(nextFrequency));
  const updateAppearance = (patch) => setSaved((current) => { const currentAppearance = current.appearance || { ...APPEARANCE_DEFAULTS, mode: current.dark ? "dark" : "light" }; const nextAppearance = { ...currentAppearance, ...patch }; const nextDark = nextAppearance.mode === "system" ? systemDark : nextAppearance.mode === "dark"; return { ...current, appearance: nextAppearance, dark: nextDark }; });
  const toggleDark = () => updateAppearance({ mode: dark ? "light" : "dark" });
  const updateProfilePhoto = async (file) => {
    try {
      const profilePhoto = await prepareProfilePhoto(file);
      setSaved((current) => ({ ...current, profilePhoto }));
      setToast("Profile picture updated and securely synced");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not use that image");
    }
  };
  const updateAccount = (kind, id, accountPatch) => { const key = kind === "advance" ? "advanceAccounts" : "creditAccounts"; setSaved((current) => ({ ...current, [key]: current[key].map((account) => account.id === id ? { ...account, ...accountPatch } : account) })); };
  const updateCategoryGroups = (nextGroups) => setSaved((current) => ({ ...current, categoryConfig: { ...(current.categoryConfig || {}), [frequency]: nextGroups } }));
  const resetCategoryGroups = () => setSaved((current) => ({ ...current, categoryConfig: { ...(current.categoryConfig || {}), [frequency]: restoreCategoryOrder(current.categoryConfig || {}, frequency) } }));
  const updateAnalyticsModules = (analyticsModules) => setSaved((current) => ({ ...current, analyticsModules }));
  const reset = () => { if (window.confirm("Reset all local expense data, budget and ledgers to the original demo?")) { setSaved(createDefaultState()); setToast("Demo data restored"); } };
  const installApp = async () => { if (!installPrompt) { setToast("Use your browser menu to add Pocket Ledger to the home screen"); return; } await installPrompt.prompt(); const result = await installPrompt.userChoice; if (result.outcome === "accepted") setToast("Pocket Ledger installed"); setInstallPrompt(null); };

  let view;
  if (active === "transactions") view = <TransactionsView expenses={expenses} aliases={aliases} frequency={frequency} onEdit={(expense) => openEdit(expense)} onAdd={openNew} />;
  else if (active === "ledger") view = <LedgerView records={records} archives={saved.archivedExpenses || []} aliases={aliases} onEdit={(expense) => openEdit(expense, true)} onAdd={openLedgerDate} />;
  else if (active === "budget") view = <BudgetView monthlyBudget={saved.monthlyBudget} monthlyBudgets={saved.monthlyBudgets} expenses={expenses} advanceAccounts={saved.advanceAccounts} creditAccounts={saved.creditAccounts} onBudgetChange={(monthKey, monthlyBudget) => { setSaved((current) => withBudgetForMonth(current, monthKey, monthlyBudget)); setToast(`${monthLabel(monthKey)} budget saved`); }} onAccountChange={updateAccount} />;
  else if (active === "categories") view = <CategoriesView expenses={expenses} frequency={frequency} categoryConfig={saved.categoryConfig || {}} onChange={updateCategoryGroups} onReset={() => { resetCategoryGroups(); setToast(`${FREQUENCY_LABELS[frequency]} category order restored`); }} onNotice={setToast} />;
  else if (active === "reports") view = <ReportsView expenses={expenses} aliases={aliases} monthlyBudget={saved.monthlyBudget} monthlyBudgets={saved.monthlyBudgets} analyticsModules={saved.analyticsModules || DEFAULT_ANALYTICS_MODULES} onModulesChange={updateAnalyticsModules} onEdit={(expense) => openEdit(expense)} />;
  else if (active === "settings") view = <><SettingsView appearance={appearance} onAppearanceChange={updateAppearance} onReset={reset} installAvailable={Boolean(installPrompt)} installed={installed} onInstall={installApp} /><section className="module-card account-session-card"><div><strong>Signed in as {user.email}</strong><span>Your database-backed ledger is synced to this account.</span></div><button className="secondary-button" type="button" onClick={() => authClient.signOut()}>Sign out</button></section></>;
  else view = <Dashboard expenses={expenses} aliases={aliases} frequency={frequency} monthlyBudget={saved.monthlyBudget} monthlyBudgets={saved.monthlyBudgets} advanceAccounts={saved.advanceAccounts} creditAccounts={saved.creditAccounts} onEdit={(expense) => openEdit(expense)} onViewAll={() => navigate("transactions")} />;

  const showFrequencyTabs = ["dashboard", "transactions", "categories"].includes(active);
  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to main content</a><Sidebar active={active} onNavigate={navigate} dark={dark} onToggleDark={toggleDark} budgetSpent={budgetSpent} monthlyBudget={currentBudget} profilePhoto={saved.profilePhoto} onProfilePhoto={updateProfilePhoto} />{mobileMenu && <MobileMenuDrawer active={active} onNavigate={navigate} onClose={() => setMobileMenu(false)} dark={dark} onToggleDark={toggleDark} profilePhoto={saved.profilePhoto} onProfilePhoto={updateProfilePhoto} />}<main className="main-content" id="main-content" tabIndex="-1"><Header active={active} user={user} onAdd={openNew} onToggleMenu={() => setMobileMenu(true)} menuOpen={mobileMenu} />{showFrequencyTabs && <FrequencyTabs value={frequency} onChange={navigateFrequency} />}<div className="view-stage" key={`${active}-${frequency}`}>{view}</div></main><MobileNav active={active} onNavigate={navigate} />{drawer.open && <AddExpenseDrawer key={drawer.expense?.id || `new-${frequency}-${drawer.initialDate}`} expense={drawer.expense} aliases={aliases} defaultFrequency={frequency} initialDate={drawer.initialDate} defaultStatus={drawer.defaultStatus} requiresDisclaimers={drawer.requiresDisclaimers} monthlyBudget={saved.monthlyBudget} monthlyBudgets={saved.monthlyBudgets} advanceAccounts={saved.advanceAccounts} creditAccounts={saved.creditAccounts} categoryConfig={saved.categoryConfig || {}} allExpenses={expenses} onClose={closeDrawer} onSave={saveExpense} onDelete={deleteExpense} />}{toast && <div className="toast" role="status"><Check size={18} weight="bold" /> {toast}</div>}</div>;
}

export function App() {
  if (window.location.pathname.endsWith("/reset-password")) return <ResetPasswordScreen />;
  const session = authClient.useSession();
  const [ledger, setLedger] = useState(null);
  const [localState] = useState(loadState);
  const [needsChoice, setNeedsChoice] = useState(false);
  const [setupBusy, setSetupBusy] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");

  useEffect(() => {
    if (!session.data?.user?.id) { setLedger(null); setNeedsChoice(false); return; }
    let active = true;
    fetch("/api/state", { credentials: "include" }).then(async (response) => {
      if (!response.ok) throw new Error("Could not open your ledger.");
      return response.json();
    }).then((result) => { if (active) { if (result.hasData) setLedger(result.state); else setNeedsChoice(true); } }).catch((error) => { if (active) setSetupMessage(error.message); });
    return () => { active = false; };
  }, [session.data?.user?.id]);

  const chooseStart = async (mode) => {
    setSetupBusy(true); setSetupMessage("");
    try {
      const response = await fetch(mode === "import" ? "/api/state/import" : "/api/state/start-fresh", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: mode === "import" ? JSON.stringify(localState) : undefined });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Setup could not be completed.");
      if (mode === "import") localStorage.removeItem(STORAGE_KEY);
      setLedger(result.state); setNeedsChoice(false);
    } catch (error) { setSetupMessage(error instanceof Error ? error.message : "Setup could not be completed."); }
    finally { setSetupBusy(false); }
  };

  if (session.isPending) return <main className="app-loading"><span className="brand-mark"><Wallet weight="fill" /></span><strong>Opening Pocket Ledger…</strong></main>;
  if (!session.data?.user) return <AuthScreen />;
  if (needsChoice) return <ImportChoice state={localState} onImport={() => chooseStart("import")} onFresh={() => chooseStart("fresh")} busy={setupBusy} message={setupMessage} />;
  if (!ledger) return <main className="app-loading"><span className="brand-mark"><Wallet weight="fill" /></span><strong>{setupMessage || "Loading your secure ledger…"}</strong></main>;
  return <LedgerApp key={session.data.user.id} initialState={ledger} user={session.data.user} />;
}
