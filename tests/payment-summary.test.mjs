import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentSummaries, matchesPayment } from '../src/payment-summary.js';
import { translateDisplayText } from '../src/i18n.js';
const entry = (id, amount, date = '2026-09-08', payment = 'advance-1', status = 'actual') => ({ id, amount, date, payment, status });
test('payment totals retain all original records without double counting and exclude plans', () => {
  const expenses = [entry('a', 100), entry('b', 250), entry('c', 50), entry('d', 90, undefined, 'upi'), entry('p', 999, undefined, undefined, 'planned')];
  const copy = structuredClone(expenses);
  const summaries = paymentSummaries(expenses);
  assert.equal(summaries.length, 2);
  assert.equal(summaries[0].amount, 400);
  assert.deepEqual(summaries[0].expenses.map((item) => item.id), ['a', 'b', 'c']);
  assert.deepEqual(expenses, copy);
  assert.equal(paymentSummaries([entry('a', .1), entry('b', .2)])[0].amount, .3);
});
test('day, Monday-based week and month boundaries aggregate separately', () => {
  const expenses = [entry('a', 10, '2026-09-06'), entry('b', 20, '2026-09-07'), entry('c', 30, '2026-09-08'), entry('d', 40, '2026-10-01')];
  assert.equal(paymentSummaries(expenses, 'day').length, 4);
  assert.equal(paymentSummaries(expenses, 'week').find((row) => row.date === '2026-09-07').amount, 50);
  assert.equal(paymentSummaries(expenses, 'month').find((row) => row.date === '2026-09').amount, 60);
  assert.equal(paymentSummaries([entry('y', 1, '2027-01-01')], 'week')[0].date, '2026-12-28');
});
test('budget filters exclude advance/borrow but retain ordinary credit cards', () => {
  assert.equal(matchesPayment(entry('a', 10), 'budget'), false);
  assert.equal(matchesPayment(entry('a', 10, undefined, 'credit-2'), 'credit'), true);
  assert.equal(matchesPayment(entry('a', 10, undefined, 'credit-card'), 'budget'), true);
  assert.equal(matchesPayment(entry('a', 10), 'advance-2'), false);
});
test('offline corrections preserve whitespace and unknown text without sending data', () => {
  const corrections = { hi: [{ source: 'My special shop', translation: 'मेरी खास दुकान' }] };
  assert.equal(translateDisplayText('hi', ' My special shop ', corrections), ' मेरी खास दुकान ');
  assert.equal(translateDisplayText('hi', 'My special shop 🟪', corrections), 'मेरी खास दुकान 🟪');
  assert.equal(translateDisplayText('en', 'My special shop', corrections), 'My special shop');
  assert.equal(translateDisplayText('ur', 'UnfamiliarNameZ123'), 'UnfamiliarNameZ123');
});
