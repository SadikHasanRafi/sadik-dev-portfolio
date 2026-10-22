/**
 * Structured logging. On Vercel every console line lands in Runtime Logs (and in any
 * log drain), so one JSON object per line makes them searchable by field.
 */
type Level = "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, fields?: Record<string, unknown>) {
  const line = JSON.stringify({ level, scope, message, ...fields, at: new Date().toISOString() });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Serialises an unknown thrown value into loggable fields. */
export function errorFields(err: unknown) {
  if (err instanceof Error) return { error: err.message, name: err.name, stack: err.stack };
  return { error: String(err) };
}

export const log = {
  info: (scope: string, message: string, fields?: Record<string, unknown>) => emit("info", scope, message, fields),
  warn: (scope: string, message: string, fields?: Record<string, unknown>) => emit("warn", scope, message, fields),
  error: (scope: string, message: string, err?: unknown, fields?: Record<string, unknown>) =>
    emit("error", scope, message, { ...fields, ...(err === undefined ? {} : errorFields(err)) }),
};
