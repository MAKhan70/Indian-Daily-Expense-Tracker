import test from 'node:test';
import assert from 'node:assert/strict';
import { groceryTotal } from '../src/grocery-pricing.js';
import { pieSegments } from '../src/chart-data.js';
test('quoted pack pricing works from 50 grams through one kilogram', () => {
  for (let grams = 50; grams <= 1000; grams += 50) {
    assert.equal(groceryTotal({ quantity: grams, unit: 'g', unitPrice: 63, priceQuantity: 500 }), Math.round(grams / 500 * 63 * 100) / 100);
  }
  assert.equal(groceryTotal({ quantity: 500, unit: 'g', unitPrice: 63, priceQuantity: 500 }), 63);
  assert.equal(groceryTotal({ quantity: 500, unit: 'g', unitPrice: 126, priceQuantity: 1000 }), 63);
  assert.equal(groceryTotal({ quantity: .5, unit: 'kg', unitPrice: 126, priceQuantity: 1 }), 63);
});
test('legacy per-unit prices stay unchanged; missing and invalid pricing is not calculated', () => {
  assert.equal(groceryTotal({ quantity: 5, unitPrice: 45 }), 225);
  assert.equal(groceryTotal({ quantity: 5, unitPrice: null }), null);
  assert.equal(groceryTotal({ quantity: 5, unitPrice: 10, priceQuantity: 0 }), null);
  assert.equal(groceryTotal({ quantity: 5, unitPrice: 0 }), 0);
});
test('shared pie segments preserve totals, deterministic colours, combinations and Other', () => {
  const expenses = Array.from({ length: 10 }, (_, index) => ({ payment: 'p' + index, categoryGroup: 'Food', frequency: 'daily', amount: 10 + index }));
  const rows = pieSegments(expenses, ['payment', 'category']);
  assert.equal(rows.length, 7);
  assert.equal(rows.reduce((sum, row) => sum + row.value, 0), 145);
  assert.equal(rows[6].name, 'Other');
  assert.deepEqual(pieSegments([...expenses].reverse(), ['payment','category']), rows);
  assert.equal(pieSegments([...expenses, { status: 'planned', amount: 999 }]).reduce((sum, row) => sum + row.value, 0), 145);
  assert.equal(pieSegments(expenses, ['category']).length, 1);
  assert.deepEqual(pieSegments([]), []);
});
