export const isBrowser = () => typeof window !== "undefined";

export const readStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = <T>(key: string, value: T) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key: string) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
};
