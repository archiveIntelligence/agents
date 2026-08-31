// Shared shape for every message dictionary. English (`en.ts`) is the canonical
// key set; other languages may omit keys and fall back to English per-key.
export type Messages = Record<string, string>;
