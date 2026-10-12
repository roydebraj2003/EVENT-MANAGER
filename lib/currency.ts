/**
 * Format amounts into Indian Rupee (INR / ₹) with standard Indian comma grouping.
 * e.g. 150000 -> ₹1,50,000
 */
export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0';
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}
