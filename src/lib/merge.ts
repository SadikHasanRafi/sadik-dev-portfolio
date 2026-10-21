const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Lays saved data over the defaults. Object keys come from the defaults (so
 * unknown keys are dropped and new fields get default values); arrays are taken
 * from the saved data as a whole; primitives must match the default's type.
 */
export function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (defaults === null) {
    return (isPlainObject(saved) ? saved : null) as T;
  }
  if (Array.isArray(defaults)) {
    return (Array.isArray(saved) ? saved : defaults) as T;
  }
  if (isPlainObject(defaults)) {
    const source = isPlainObject(saved) ? saved : {};
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = mergeWithDefaults((defaults as Record<string, unknown>)[key], source[key]);
    }
    return out as T;
  }
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}
