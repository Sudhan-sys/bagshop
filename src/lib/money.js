/**
 * Money formatting utilities
 */

const DEFAULT_CURRENCY = 'INR';
const DEFAULT_LOCALE = 'en-IN';

export function formatPrice(amount, currency = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(original, sale) {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function formatDiscountBadge(original, sale) {
  const discount = calculateDiscount(original, sale);
  return discount > 0 ? `${discount}% OFF` : null;
}
