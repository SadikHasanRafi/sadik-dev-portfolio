import CopyButton from "@/components/blog/CopyButton";

type Lang = "ts" | "sql" | "bash";

const KEYWORDS: Record<Lang, string[]> = {
  ts: ["export", "async", "function", "const", "let", "return", "await", "if", "else", "try", "catch", "throw", "new", "import", "from", "as", "type", "typeof", "true", "false", "null", "undefined"],
  sql: ["CREATE", "TABLE", "PRIMARY", "KEY", "NOT", "NULL", "REFERENCES", "DEFAULT", "INSERT", "INTO", "VALUES", "SELECT", "FROM", "WHERE", "UPDATE", "SET", "ON", "CONFLICT", "DO", "BIGSERIAL", "BIGINT", "TEXT", "JSONB", "TIMESTAMPTZ"],
  bash: ["npx", "git", "add", "pnpm", "npm"],
};

// One pass tokenizer: comments, strings, numbers, keywords, function calls.
const TOKEN =
  /(\/\/[^\n]*|#[^\n]*|--[^\n]*)|(`(?:\\`|[^`])*`|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)(?=\s*\()|(\b[A-Za-z_$][\w$]*\b)/g;

function highlight(code: string, lang: Lang) {
  const keywords = new Set(KEYWORDS[lang]);
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, str, num, fn, word] = m;
    const start = m.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    last = start + text.length;

    // Only treat "#" / "--" as comments in bash / sql
    if (comment && ((comment.startsWith("#") && lang !== "bash") || (comment.startsWith("--") && lang !== "sql"))) {
      out.push(text);
      continue;
    }

    const cls = comment
      ? "text-[#858383] italic"
      : str
        ? "text-[#e8ddff]"
        : num
          ? "text-[#ab8ffd]"
          : fn && !keywords.has(fn)
            ? "text-white font-semibold"
            : keywords.has(fn ?? word ?? "")
              ? "text-[#cebdff]"
              : null;
    out.push(cls ? (
      <span key={i++} className={cls}>
        {text}
      </span>
    ) : (
      text
    ));
  }
  out.push(code.slice(last));
  return out;
}

/** Dark "terminal" code plate. Highlighting happens at build time — no client JS. */
export default function CodeBlock({ code, file, lang }: { code: string; file: string; lang: Lang }) {
  return (
    <figure data-dark className="my-8 overflow-hidden border border-night-line bg-night">
      <figcaption className="flex items-center justify-between gap-4 border-b border-night-line bg-[#111113] px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-[#444]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#444]" />
          <span className="size-2.5 shrink-0 rounded-full bg-[#444]" />
          <span className="ml-2 truncate font-mono text-[0.72rem] uppercase tracking-wider text-night-muted">{file}</span>
        </span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed text-[#d4d4d8] sm:p-5">
        <code>{highlight(code, lang)}</code>
      </pre>
    </figure>
  );
}
