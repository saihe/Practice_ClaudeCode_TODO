import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage on mount (after SSR hydration)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, [key]);

  // Persist to localStorage whenever value changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  }, [key, value, isHydrated]);

  return [value, setValue];
}
