import { isAdvancePayment, isCreditBorrow, isBudgetExpense } from './domain.js';

export function matchesPayment(expense, payment) {
  return payment === 'all' || (payment === 'advance' ? isAdvancePayment(expense.payment) : payment === 'credit' ? isCreditBorrow(expense.payment) : payment === 'budget' ? isBudgetExpense(expense) : expense.payment === payment);
}

export function paymentSummaries(expenses, period = 'day') {
  const groups = new Map();
  for (const expense of expenses) {
    if (expense.status === 'planned') continue;
    let date = expense.date;
    if (period === 'month') date = date.slice(0, 7);
    if (period === 'week') {
      const monday = new Date(`${date}T12:00:00Z`);
      monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
      date = monday.toISOString().slice(0, 10);
    }
    const key = `${date}|${expense.payment}`;
    const group = groups.get(key) || { key, date, payment: expense.payment, amount: 0, expenses: [] };
    group.amount = Math.round((group.amount + Number(expense.amount)) * 100) / 100;
    group.expenses.push(expense);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount);
}
