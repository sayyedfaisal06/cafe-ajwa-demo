import { useSyncExternalStore } from 'react'

/*
 * Favourite dishes, saved in this browser. The backend has no favourites endpoint yet, so they do
 * not follow the customer to another device. Other open tabs update through the storage event.
 * Prerendered pages start with no favourites, then pick up the saved list once the app runs, so
 * the first render always matches the HTML.
 */
const STORAGE_KEY = 'cafe-ajwa:favourites'
const EMPTY: string[] = []
const listeners = new Set<() => void>()
let cache: string[] | null = null

function read(): string[] {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
      cache = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
    } catch {
      cache = []
    }
  }
  return cache
}

function write(next: string[]) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private browsing or full storage: keep favourites for this visit only.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useFavourites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY)
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => write(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]),
    clear: () => write([]),
  }
}
