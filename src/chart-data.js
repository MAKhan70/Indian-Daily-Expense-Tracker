import { FREQUENCIES, isBudgetExpense, isAdvancePayment } from './domain.js';
export const CHART_COLORS = ['#648955', '#d2a533', '#b96f52', '#77518c', '#5f7f8f', '#9b687a', '#78834b', '#a86646'];
export function pieSegments(expenses, parameters = ['payment'], aliases = {}) {
  const rows = new Map();
  for (const expense of expenses) {
    if (expense.status === 'planned') continue;
    const name = parameters.map((parameter) => {
      if (parameter === 'payment') return aliases[expense.payment] || expense.payment;
      if (parameter === 'category') return expense.categoryGroup || expense.category;
      if (parameter === 'frequency') return FREQUENCIES.find((item) => item.id === expense.frequency)?.label || expense.frequency;
      return isBudgetExpense(expense) ? 'Monthly budget' : isAdvancePayment(expense.payment) ? 'Advance payment' : 'Credit borrow';
    }).join(' · ');
    rows.set(name, (rows.get(name) || 0) + Number(expense.amount));
  }
  const sorted = [...rows].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  const visible = sorted.length > 7 ? [...sorted.slice(0, 6), { name: 'Other', value: sorted.slice(6).reduce((sum, row) => sum + row.value, 0) }] : sorted;
  return visible.map((row, index) => ({ ...row, fill: CHART_COLORS[index % CHART_COLORS.length] }));
}
