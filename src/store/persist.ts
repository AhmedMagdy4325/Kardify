import type { Card, List, Project } from "../types";

type PersistedState = { projects: Project[]; lists: List[]; cards: Card[] };

const KEY = "kardify-state";

export function loadState(): PersistedState | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);

    if (
      Array.isArray(parsed?.projects) &&
      Array.isArray(parsed?.lists) &&
      Array.isArray(parsed?.cards)
    ) {
      return parsed;
    }
  } catch {
    // corrupted JSON or storage blocked: fall back to the seed data
  }
  return undefined;
}

export function saveState(state: PersistedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked: the app keeps working, it just won't persist
  }
}
