// Price is quoted for priceQuantity of the item's selected unit. Legacy rows are per 1 unit.
export function groceryTotal(item) {
  if (item.unitPrice === null || item.unitPrice === '' || item.unitPrice === undefined) return null;
  const quantity = Number(item.quantity);
  const price = Number(item.unitPrice);
  const basis = Number(item.priceQuantity ?? 1);
  if (!Number.isFinite(quantity) || !Number.isFinite(price) || !Number.isFinite(basis) || quantity <= 0 || price < 0 || basis <= 0) return null;
  return Math.round((quantity / basis * price + Number.EPSILON) * 100) / 100;
}
export const groceryMoney = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
