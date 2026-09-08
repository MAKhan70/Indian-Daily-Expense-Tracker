import { useState } from 'react';
import { DISPLAY_MONTH, FREQUENCIES, PAYMENT_GROUPS, expensesForMonth, formatINR, monthLabel, shiftMonthKey, titleCaseDate } from './domain.js';
import { matchesPayment, paymentSummaries } from './payment-summary.js';

export function PaymentTransactions({ expenses, aliases, frequency, scope, onEdit, onAdd }) {
  const [month, setMonth] = useState(scope?.month || DISPLAY_MONTH);
  const [payment, setPayment] = useState(scope?.payment || 'all');
  const [expenseFrequency, setExpenseFrequency] = useState('all');
  const [period, setPeriod] = useState('day');
  const [query, setQuery] = useState('');
  const filtered = expensesForMonth(expenses, month).filter((expense) =>
    matchesPayment(expense, payment) && (expenseFrequency === 'all' || expense.frequency === expenseFrequency) &&
    [expense.name, expense.merchant, expense.category, expense.date, aliases[expense.payment]].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const summaries = paymentSummaries(filtered, period);
  const totals = paymentSummaries(filtered, 'month');
  return <section className="module-card payment-transactions">
    <div className="section-heading"><div><span className="eyebrow">Transactions</span><h2>{monthLabel(month)}</h2><p>Payment totals with every original expense underneath. Summaries do not add new expenses.</p></div><button className="primary-button" onClick={onAdd}>Log Expense</button></div>
    <div className="payment-filter-grid">
      <label>Month<div className="payment-month"><button aria-label="Previous transaction month" onClick={() => setMonth(shiftMonthKey(month, -1))}>‹</button><input aria-label="Transaction month" type="month" value={month} onChange={(event) => event.target.value && setMonth(event.target.value)} /><button aria-label="Next transaction month" onClick={() => setMonth(shiftMonthKey(month, 1))}>›</button></div></label>
      <label>Payment method<select aria-label="Payment method" value={payment} onChange={(event) => setPayment(event.target.value)}><option value="all">All payment methods</option><option value="budget">Monthly budget payments</option><option value="advance">All Advance payments</option><option value="credit">All Credit borrow payments</option>{PAYMENT_GROUPS.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map(([id, label]) => <option value={id} key={id}>{aliases[id] || label}</option>)}</optgroup>)}</select></label>
      <label>Expense frequency<select aria-label="Expense frequency" value={expenseFrequency} onChange={(event) => setExpenseFrequency(event.target.value)}><option value="all">All frequencies</option>{FREQUENCIES.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      <label>Group totals by<select aria-label="Group totals by" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option></select></label>
      <label>Search transactions<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Expense, merchant, category or date" /></label>
    </div>
    <div className="payment-overview"><strong>Total: {formatINR(filtered.reduce((sum, item) => sum + Number(item.amount), 0))}</strong>{totals.map((row) => <button key={row.key} onClick={() => setPayment(row.payment)}><span>{aliases[row.payment] || row.payment}</span><b>{formatINR(row.amount)}</b></button>)}</div>
    <p className="module-subtitle">Week totals start on Monday and include only the selected month and filters.</p>
    <div className="payment-groups">{summaries.map((group) => <details key={group.key} open><summary><span><strong>{period === 'month' ? monthLabel(group.date) : `${period === 'week' ? 'Week of ' : ''}${titleCaseDate(group.date)}`}</strong><small>{aliases[group.payment] || group.payment} · {group.expenses.length} expenses</small></span><b>{formatINR(group.amount)}</b></summary><div>{group.expenses.map((expense) => <button className="payment-detail" key={expense.id} onClick={() => onEdit(expense)}><span><strong>{expense.name || expense.category}{expense.name && expense.name !== expense.category && <b className="custom-badge" aria-label="User-added entry" title="User-added entry" />}</strong><small>{expense.merchant || expense.category} · {FREQUENCIES.find((item) => item.id === expense.frequency)?.label}</small></span><span><b>{formatINR(expense.amount)}</b><small>{titleCaseDate(expense.date)}</small></span></button>)}</div></details>)}</div>
    {!summaries.length && <p className="empty-state">No expenses found for these filters.</p>}
  </section>;
}
