export function safeGet<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const v = localStorage.getItem(key)
    if (!v) return fallback
    const parsed: unknown = JSON.parse(v)
    return isValid && !isValid(parsed) ? fallback : parsed as T
  } catch {
    return fallback
  }
}
export function safeSet(key: string, val: unknown) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(val)) } catch { void 0 }
}
export function safeRemove(key: string) {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key) } catch { void 0 }
}
