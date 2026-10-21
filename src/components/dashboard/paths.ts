import { defaultContent } from "@/content/defaults";

/**
 * Paths are dot strings ("work.projects.0.name"); numeric segments are array
 * indexes. A "pattern" replaces indexes with [] ("work.projects[].name") and is
 * what hints and default-shape lookups are keyed on.
 */
export type Key = string | number;

export const parsePath = (path: string): Key[] =>
  path ? path.split(".").map((k) => (/^\d+$/.test(k) ? Number(k) : k)) : [];

export const joinPath = (path: string, key: Key) => (path ? `${path}.${key}` : String(key));

export const patternOf = (path: string) => path.replace(/\.\d+(?=\.|$)/g, "[]");

export const lastKey = (path: string) => {
  const keys = parsePath(path);
  for (let i = keys.length - 1; i >= 0; i--) if (typeof keys[i] === "string") return keys[i] as string;
  return "";
};

export function getIn(root: unknown, path: string): unknown {
  let node = root;
  for (const key of parsePath(path)) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Record<string | number, unknown>)[key];
  }
  return node;
}

/** Immutable update that copies only the objects along the path. */
export function setIn<T>(root: T, path: string, value: unknown): T {
  const keys = parsePath(path);
  const write = (node: unknown, i: number): unknown => {
    if (i === keys.length) return value;
    const key = keys[i];
    if (Array.isArray(node)) {
      const copy = node.slice();
      copy[key as number] = write(node[key as number], i + 1);
      return copy;
    }
    const obj = (node && typeof node === "object" ? node : {}) as Record<string, unknown>;
    return { ...obj, [key]: write(obj[key as string], i + 1) };
  };
  return write(root, 0) as T;
}

/** The factory-default value at a pattern (first array item stands in for []). */
export function defaultAt(pattern: string): unknown {
  let node: unknown = defaultContent;
  for (const part of pattern.split(".")) {
    if (!part) continue;
    const [name, ...brackets] = part.split("[]");
    if (name) node = node && typeof node === "object" ? (node as Record<string, unknown>)[name] : undefined;
    for (let b = 0; b < brackets.length; b++) node = Array.isArray(node) ? node[0] : undefined;
  }
  return node;
}

const uid = () => Math.random().toString(36).slice(2, 8);

/** An empty item shaped like `sample`; ids/slugs get unique values. */
export function blankLike(sample: unknown, key = ""): unknown {
  if (Array.isArray(sample)) return [];
  if (sample === null) return null;
  if (typeof sample === "boolean") return key === "visible" ? true : sample;
  if (typeof sample === "number") return 0;
  if (typeof sample === "string") {
    if (key === "slug" || key === "id") return `new-${uid()}`;
    return "";
  }
  if (typeof sample === "object") {
    const obj = sample as Record<string, unknown>;
    if ("src" in obj && ("width" in obj || "name" in obj)) return { ...obj };
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, blankLike(v, k)]));
  }
  return sample;
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
