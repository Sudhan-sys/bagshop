/**
 * LocalStorage utilities with SSR safety
 */

const CART_KEY = 'bagshop_cart';

export function getStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function setStoredCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

export function clearStoredCart() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error('Failed to clear cart:', e);
  }
}
