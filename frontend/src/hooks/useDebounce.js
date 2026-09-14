import { useState, useEffect } from 'react';

/**
 * Custom React Hook: useDebounce
 *
 * Purpose:
 * Prevents triggering an API search request on every single keystroke.
 * Instead, it delays updating the debounced value until the user has
 * stopped typing for the specified delay (default 400ms).
 *
 * How it works:
 * 1. State `debouncedValue` holds the debounced search keyword.
 * 2. `useEffect` sets a `setTimeout` timer whenever `value` or `delay` changes.
 * 3. If user types again before 400ms expires, the cleanup function `clearTimeout(handler)`
 *    cancels the previous timer and starts a fresh one.
 * 4. Once 400ms passes without typing, the callback fires and updates `debouncedValue`.
 *
 * @param {any} value - The input value to debounce (e.g. search keyword)
 * @param {number} delay - The debounce delay in milliseconds (default: 400ms)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel previous timer if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
