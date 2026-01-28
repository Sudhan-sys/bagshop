/**
 * General utility functions
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
