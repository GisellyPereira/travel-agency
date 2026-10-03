"use client";

import { useState, useSyncExternalStore } from "react";
import { destinations } from "../../data/travel";

const FAVORITES_KEY = "fora-destinations-v1";
const FAVORITES_EVENT = "fora-favorites-change";
function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}
function favoriteSnapshot() {
  try {
    return window.localStorage.getItem(FAVORITES_KEY) || "[]";
  } catch {
    return "[]";
  }
}
export function useFavorites() {
  const raw = useSyncExternalStore(
    subscribeFavorites,
    favoriteSnapshot,
    () => "[]",
  );
  let favorites: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed))
      favorites = parsed.filter(
        (id): id is string =>
          typeof id === "string" && destinations.some((d) => d.id === id),
      );
  } catch {
    /* Invalid storage is treated as an empty collection. */
  }
  const [temporary, setTemporary] = useState<string[] | null>(null);
  const selected = temporary ?? favorites;
  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setTemporary(null);
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      setTemporary(next);
    }
  }
  return { favorites: selected, toggle };
}
