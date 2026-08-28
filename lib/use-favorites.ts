"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "depaola:favorites";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): string[] {
  if (cache == null) cache = read();
  return cache;
}

const EMPTY: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.) — no bloquea la UI.
  }
  listeners.forEach((listener) => listener());
}

// Favoritos por dispositivo (sin login) — coherente con la Fase 18: Favorite
// no requiere un User registrado, solo se vincula a uno si la persona deja
// su contacto en algún flujo más adelante.
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((propertyId: string) => {
    const current = getSnapshot();
    const next = current.includes(propertyId) ? current.filter((id) => id !== propertyId) : [...current, propertyId];
    write(next);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, ready: true, toggle, isFavorite };
}
