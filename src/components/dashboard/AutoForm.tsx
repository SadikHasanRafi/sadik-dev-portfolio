"use client";

import { createContext, memo, useContext, useEffect, useRef, useState } from "react";
import { FileField, ImageField } from "@/components/dashboard/AssetFields";
import IconPicker from "@/components/dashboard/IconPicker";
import { nextId, SortableList, useRowIds } from "@/components/dashboard/Sortable";
import { DButton, DIcon, FieldShell, IconButton, inputClass, Panel, Toggle } from "@/components/dashboard/ui";
import { hintFor, labelFor, type Hint, type Option } from "@/components/dashboard/hints";
import { blankLike, defaultAt, joinPath, lastKey, patternOf } from "@/components/dashboard/paths";
import { cn } from "@/lib/utils";
import type { FileAsset, IconName, ImageAsset, SiteContent } from "@/types";

/* ---------- Context: a stable updater + the current content for dynamic options ---------- */

export const UpdateContext = createContext<(path: string, value: unknown) => void>(() => {});
export const ContentContext = createContext<SiteContent | null>(null);

/* ---------- Shape helpers ---------- */

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isImage = (v: unknown): v is ImageAsset => isObject(v) && "src" in v && "width" in v;
const isFile = (v: unknown): v is FileAsset => isObject(v) && "src" in v && "name" in v && !("width" in v);

const LONG_LIST_KEYS = ["points", "highlights", "deliverables", "achievements", "items", "courses"];

function kindOf(value: unknown, hint: Hint, key: string): string {
  if (hint.kind) return hint.kind;
  if (isImage(value)) return "image";
  if (isFile(value)) return "file";
  if (key === "icon") return "icon";
  if (typeof value === "boolean") return "toggle";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return value.length > 90 ? "textarea" : "text";
  if (Array.isArray(value)) return "array";
  if (isObject(value)) return "object";
  return "unknown";
}

/** Fields that need the full width of the form grid. */
const isWide = (kind: string) => ["textarea", "code", "array", "object", "image", "file", "strings", "multiselect"].includes(kind);

function itemTitle(item: unknown, hint: Hint): string {
  if (!isObject(item)) return String(item ?? "");
  if (hint.fixed && hint.titles && typeof item.id === "string") return hint.titles[item.id] ?? item.id;
  if (hint.union) {
    const type = String(item[hint.union.key]);
    const text = [item.text, item.label, item.file, item.caption].find((v) => typeof v === "string" && v) as string | undefined;
    return `${hint.union.labels[type] ?? type}${text ? ` — ${text}` : ""}`;
  }
  for (const k of ["name", "title", "label", "q", "role", "short", "period", "phase", "kicker", "value", "id"]) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v;
    if (isObject(v) && typeof v.lead === "string") return [v.lead, v.accent].filter(Boolean).join(" ");
  }
  return "Untitled";
}

function itemSubtitle(item: unknown): string {
  if (!isObject(item)) return "";
  for (const k of ["org", "category", "handle", "date", "kicker", "href"]) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

/* ---------- Field ---------- */

type FieldProps = { path: string; value: unknown; label?: string; /** Lists drop their title when a panel already shows it */ headless?: boolean };

/** Renders the right editor for whatever lives at `path`. Memoised: unchanged branches skip re-rendering. */
export const Field = memo(function Field({ path, value, label: labelOverride, headless }: FieldProps) {
  const update = useContext(UpdateContext);
  const pattern = patternOf(path);
  const key = lastKey(path);
  const hint = hintFor(pattern, key);
  const label = labelOverride ?? labelFor(pattern, key);
  const kind = kindOf(value, hint, key);
  const set = (v: unknown) => update(path, v);
  const id = `f-${path.replace(/\./g, "-")}`;

  switch (kind) {
    case "hidden":
      return null;
    case "image":
      return <ImageField label={label} help={hint.help} value={(value as ImageAsset | null) ?? null} nullable={value === null || hint.kind === "image"} onChange={set} />;
    case "file":
      return <FileField label={label} help={hint.help} value={value as FileAsset} onChange={set} />;
    case "icon":
      return <IconPicker label={label} value={value as IconName} onChange={set} />;
    case "toggle":
      return <Toggle id={id} checked={Boolean(value)} onChange={set} label={label} />;
    case "number":
      return (
        <FieldShell label={label} help={hint.help} htmlFor={id}>
          <input id={id} type="number" className={inputClass} value={Number(value)} onChange={(e) => set(Number(e.target.value))} />
        </FieldShell>
      );
    case "date":
      return (
        <FieldShell label={label} help={hint.help} htmlFor={id}>
          <input id={id} type="date" className={inputClass} value={String(value)} onChange={(e) => set(e.target.value)} />
        </FieldShell>
      );
    case "select":
      return <SelectField id={id} label={label} hint={hint} value={String(value)} onChange={set} />;
    case "multiselect":
      return <MultiSelect label={label} hint={hint} value={(value as string[]) ?? []} onChange={set} />;
    case "textarea":
    case "code":
      return (
        <FieldShell label={label} help={hint.help} htmlFor={id}>
          <textarea
            id={id}
            rows={kind === "code" ? 10 : 3}
            spellCheck={kind !== "code"}
            className={cn(inputClass, "resize-y [field-sizing:content]", kind === "code" ? "min-h-[12rem] font-mono text-[0.8rem] leading-relaxed" : "min-h-[5rem]")}
            value={String(value ?? "")}
            placeholder={hint.placeholder}
            onChange={(e) => set(e.target.value)}
          />
        </FieldShell>
      );
    case "text":
      return (
        <FieldShell label={label} help={hint.help} htmlFor={id}>
          <input id={id} className={inputClass} value={String(value ?? "")} placeholder={hint.placeholder} onChange={(e) => set(e.target.value)} />
        </FieldShell>
      );
    case "array":
    case "strings": {
      const items = (value as unknown[]) ?? [];
      const sample = items[0] ?? defaultAt(`${pattern}[]`);
      if (kind === "strings" || typeof sample === "string" || (sample === undefined && !hint.template && !hint.union)) {
        return <StringList path={path} items={items as string[]} label={label} hint={hint} long={LONG_LIST_KEYS.includes(key)} headless={headless} />;
      }
      return <ObjectList path={path} items={items} label={label} hint={hint} sample={sample} headless={headless} />;
    }
    case "object":
      return (
        <fieldset className="min-w-0 border-l-2 border-line pl-4">
          <legend className="mb-3 text-[0.8rem] font-semibold text-ink">{label}</legend>
          {hint.help && <p className="-mt-1 mb-3 text-[0.75rem] text-muted">{hint.help}</p>}
          <Group path={path} value={value as Record<string, unknown>} />
        </fieldset>
      );
    default:
      return null;
  }
});

/* ---------- Group: an object's fields in a responsive grid ---------- */

export function Group({ path, value, exclude = [] }: { path: string; value: Record<string, unknown>; exclude?: string[] }) {
  const entries = Object.entries(value).filter(([k]) => !exclude.includes(k));
  const visible = entries.find(([k]) => k === "visible");
  const rest = entries.filter(([k]) => k !== "visible");

  return (
    <div className="flex flex-col gap-5">
      {visible && <Field path={joinPath(path, "visible")} value={visible[1]} />}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {rest.map(([k, v]) => {
          const p = joinPath(path, k);
          const kind = kindOf(v, hintFor(patternOf(p), k), k);
          if (kind === "hidden") return null;
          return (
            <div key={k} className={cn("min-w-0", isWide(kind) && "md:col-span-2")}>
              <Field path={p} value={v} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Select / multi-select ---------- */

function useOptions(hint: Hint): Option[] {
  const content = useContext(ContentContext);
  if (typeof hint.options === "function") return content ? hint.options(content) : [];
  return hint.options ?? [];
}

function SelectField({ id, label, hint, value, onChange }: { id: string; label: string; hint: Hint; value: string; onChange: (v: string) => void }) {
  const options = useOptions(hint);
  const known = options.some((o) => o.value === value);
  return (
    <FieldShell label={label} help={hint.help} htmlFor={id}>
      <select id={id} className={cn(inputClass, "appearance-none")} value={value} onChange={(e) => onChange(e.target.value)}>
        {!known && <option value={value}>{value || "— choose —"}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function MultiSelect({ label, hint, value, onChange }: { label: string; hint: Hint; value: string[]; onChange: (v: string[]) => void }) {
  const options = useOptions(hint);
  return (
    <FieldShell label={label} help={hint.help}>
      <div className="flex flex-wrap gap-2">
        {options.length === 0 && <span className="text-[0.8rem] text-muted">Nothing to choose from yet.</span>}
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
              className={cn(
                "flex items-center gap-1.5 border px-3 py-1.5 text-[0.8rem] transition-colors",
                on ? "border-violet bg-violet text-on-ink" : "border-line bg-bg text-ink hover:border-ink",
              )}
            >
              {on && <DIcon name="check" className="size-3.5" strokeWidth={2.4} />}
              {o.label}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ---------- Lists ---------- */

function ListHeader({ label, help, count }: { label: string; help?: string; count: number }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline gap-2">
        <span className="text-[0.8rem] font-semibold text-ink">{label}</span>
        <span className="font-mono text-[0.7rem] text-muted">{count}</span>
      </div>
      {help && <p className="mt-0.5 text-[0.75rem] text-muted">{help}</p>}
    </div>
  );
}

/** Two-step delete: first click arms, second click removes. */
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return armed ? (
    <button type="button" onClick={onDelete} className="shrink-0 bg-alert px-2.5 py-1.5 text-[0.75rem] font-medium text-white">
      Delete?
    </button>
  ) : (
    <IconButton label="Delete" icon="trash" onClick={() => setArmed(true)} className="hover:text-alert" />
  );
}

function StringList({ path, items, label, hint, long, headless }: { path: string; items: string[]; label: string; hint: Hint; long: boolean; headless?: boolean }) {
  const update = useContext(UpdateContext);
  const { ids, setIds } = useRowIds(items.length);
  const listRef = useRef<HTMLDivElement>(null);
  const noun = hint.item ?? "item";

  const focusRow = (index: number) =>
    requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLElement>("[data-row-input]")[index]?.focus());

  const insert = (at: number) => {
    const next = [...items.slice(0, at), "", ...items.slice(at)];
    setIds([...ids.slice(0, at), nextId(), ...ids.slice(at)]);
    update(path, next);
    focusRow(at);
  };
  const remove = (i: number) => {
    setIds(ids.filter((_, j) => j !== i));
    update(path, items.filter((_, j) => j !== i));
  };

  return (
    <div ref={listRef}>
      {!headless && <ListHeader label={label} help={hint.help} count={items.length} />}
      <SortableList
        items={items}
        ids={ids}
        setIds={setIds}
        onReorder={(next) => update(path, next)}
        renderRow={(item, i, handle) => (
          <div className="flex items-start gap-1 border border-line bg-bg pr-1">
            <div className="pt-1">{handle}</div>
            {long ? (
              <textarea
                data-row-input
                rows={1}
                value={item}
                aria-label={`${label} ${i + 1}`}
                onChange={(e) => update(`${path}.${i}`, e.target.value)}
                className="min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-[0.88rem] text-ink [field-sizing:content] focus:outline-none"
              />
            ) : (
              <input
                data-row-input
                value={item}
                aria-label={`${label} ${i + 1}`}
                onChange={(e) => update(`${path}.${i}`, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    insert(i + 1);
                  } else if (e.key === "Backspace" && item === "" && items.length > 1) {
                    e.preventDefault();
                    remove(i);
                    focusRow(Math.max(0, i - 1));
                  }
                }}
                className="h-10 min-w-0 flex-1 bg-transparent px-1 text-[0.88rem] text-ink focus:outline-none"
              />
            )}
            <div className="pt-1">
              <IconButton label={`Remove ${noun}`} icon="close" onClick={() => remove(i)} className="hover:text-alert" />
            </div>
          </div>
        )}
      />
      <DButton size="sm" variant="ghost" className="mt-2" onClick={() => insert(items.length)}>
        <DIcon name="plus" className="size-3.5" /> Add {noun}
      </DButton>
    </div>
  );
}

function ObjectList({ path, items, label, hint, sample, headless }: { path: string; items: unknown[]; label: string; hint: Hint; sample: unknown; headless?: boolean }) {
  const update = useContext(UpdateContext);
  const { ids, setIds } = useRowIds(items.length);
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [menu, setMenu] = useState(false);
  const noun = hint.item ?? "item";

  const create = (type?: string) =>
    hint.union && type ? hint.union.templates[type]() : hint.template ? hint.template() : blankLike(sample);

  const add = (type?: string) => {
    const id = nextId();
    setIds([...ids, id]);
    update(path, [...items, create(type)]);
    setOpen((s) => new Set(s).add(id));
    setMenu(false);
  };
  const duplicate = (i: number) => {
    const copy = structuredClone(items[i]) as Record<string, unknown>;
    for (const k of ["slug", "id"]) if (typeof copy?.[k] === "string" && !hint.fixed) copy[k] = `${copy[k]}-copy`;
    setIds([...ids.slice(0, i + 1), nextId(), ...ids.slice(i + 1)]);
    update(path, [...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
  };
  const remove = (i: number) => {
    setIds(ids.filter((_, j) => j !== i));
    update(path, items.filter((_, j) => j !== i));
  };
  const toggleOpen = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      {!headless && <ListHeader label={label} help={hint.help} count={items.length} />}
      <SortableList
        items={items}
        ids={ids}
        setIds={setIds}
        onReorder={(next) => update(path, next)}
        renderRow={(item, i, handle) => {
          const rowId = ids[i];
          const isOpen = open.has(rowId);
          const obj = isObject(item) ? item : {};
          const hasVisible = typeof obj.visible === "boolean";
          const hidden = hasVisible && obj.visible === false;
          const subtitle = itemSubtitle(item);
          return (
            <div className={cn("border bg-paper transition-colors", isOpen ? "border-ink/40" : "border-line", hidden && "bg-strip")}>
              <div className="flex items-center gap-1 pr-1">
                {handle}
                <button
                  type="button"
                  onClick={() => !hint.fixed && toggleOpen(rowId)}
                  aria-expanded={hint.fixed ? undefined : isOpen}
                  className={cn("flex min-w-0 flex-1 items-center gap-3 py-2.5 text-left", hint.fixed && "cursor-default")}
                >
                  <span className="font-mono text-[0.7rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className={cn("block truncate text-[0.88rem] font-medium", hidden ? "text-muted line-through decoration-muted/50" : "text-ink")}>
                      {itemTitle(item, hint)}
                    </span>
                    {subtitle && <span className="block truncate text-[0.75rem] text-muted">{subtitle}</span>}
                  </span>
                </button>
                {hasVisible && (
                  <IconButton
                    label={hidden ? "Show on site" : "Hide from site"}
                    icon={hidden ? "eyeOff" : "eye"}
                    active={!hidden}
                    onClick={() => update(`${path}.${i}.visible`, hidden)}
                  />
                )}
                {!hint.fixed && (
                  <>
                    <IconButton label="Duplicate" icon="duplicate" onClick={() => duplicate(i)} />
                    <DeleteButton onDelete={() => remove(i)} />
                    <IconButton
                      label={isOpen ? "Collapse" : "Edit"}
                      icon="chevron"
                      onClick={() => toggleOpen(rowId)}
                      className={cn("transition-transform", isOpen && "rotate-180")}
                    />
                  </>
                )}
              </div>
              {isOpen && !hint.fixed && (
                <div className="modal-in border-t border-line px-4 pb-5 pt-4 sm:px-5">
                  {hint.union && <UnionSwitch path={`${path}.${i}`} item={obj} hint={hint} />}
                  <Group path={`${path}.${i}`} value={obj} exclude={hasVisible ? ["visible"] : []} />
                </div>
              )}
            </div>
          );
        }}
      />
      {!hint.fixed && (
        <div className="relative mt-2">
          {hint.union ? (
            <>
              <DButton size="sm" variant="ghost" onClick={() => setMenu((v) => !v)} aria-expanded={menu}>
                <DIcon name="plus" className="size-3.5" /> Add {noun}
              </DButton>
              {menu && (
                <div className="modal-in absolute left-0 top-full z-20 mt-1 flex min-w-48 flex-col border border-line bg-paper p-1 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]">
                  {Object.entries(hint.union.labels).map(([type, name]) => (
                    <button key={type} type="button" onClick={() => add(type)} className="px-3 py-2 text-left text-[0.85rem] text-ink hover:bg-strip">
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <DButton size="sm" variant="ghost" onClick={() => add()}>
              <DIcon name="plus" className="size-3.5" /> Add {noun}
            </DButton>
          )}
        </div>
      )}
    </div>
  );
}

/** Lets a union item (e.g. a post block) change type, keeping its text where possible. */
function UnionSwitch({ path, item, hint }: { path: string; item: Record<string, unknown>; hint: Hint }) {
  const update = useContext(UpdateContext);
  const union = hint.union!;
  const current = String(item[union.key]);
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {Object.entries(union.labels).map(([type, name]) => (
        <button
          key={type}
          type="button"
          aria-pressed={type === current}
          onClick={() => {
            if (type === current) return;
            const next = union.templates[type]() as Record<string, unknown>;
            if (typeof item.text === "string" && "text" in next) next.text = item.text;
            update(path, next);
          }}
          className={cn(
            "border px-2.5 py-1 text-[0.75rem] transition-colors",
            type === current ? "border-violet bg-lavender text-violet" : "border-line text-muted hover:border-ink hover:text-ink",
          )}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

/* ---------- Section editor: one root (or several) split into collapsible panels ---------- */

const isPanelWorthy = (key: string, value: unknown, path: string) => {
  const kind = kindOf(value, hintFor(patternOf(path), key), key);
  return kind === "object" || kind === "array" || kind === "strings";
};

export function SectionEditor({ roots, content, titles, open }: { roots: string[]; content: SiteContent; titles: Record<string, string>; open?: string }) {
  type PanelDef = { key: string; title: string; help?: string; body: React.ReactNode };
  const panels: PanelDef[] = [];

  for (const root of roots) {
    const value = (content as unknown as Record<string, unknown>)[root];
    const rootTitle = titles[root] ?? labelFor(root, root);
    if (Array.isArray(value)) {
      panels.push({ key: root, title: rootTitle, help: hintFor(root, root).help, body: <Field path={root} value={value} label={rootTitle} headless /> });
      continue;
    }
    if (!isObject(value)) continue;
    const entries = Object.entries(value).filter(([k]) => hintFor(patternOf(`${root}.${k}`), k).kind !== "hidden");
    const general = entries.filter(([k, v]) => !isPanelWorthy(k, v, `${root}.${k}`));
    if (general.length > 0) {
      panels.push({ key: `${root}:general`, title: rootTitle, body: <Group path={root} value={Object.fromEntries(general)} /> });
    }
    for (const [k, v] of entries.filter(([k, v]) => isPanelWorthy(k, v, `${root}.${k}`))) {
      const path = `${root}.${k}`;
      const pattern = patternOf(path);
      panels.push({
        key: path,
        title: labelFor(pattern, k),
        help: hintFor(pattern, k).help,
        body: isObject(v) ? <Group path={path} value={v} /> : <Field path={path} value={v} headless />,
      });
    }
  }

  // Search settings matter least while editing: keep them last.
  panels.sort((a, b) => Number(a.key.endsWith(".seo")) - Number(b.key.endsWith(".seo")));
  const openKey = open && panels.some((p) => p.key === open) ? open : panels[0]?.key;

  return (
    <div className="flex flex-col gap-4">
      {panels.map((p) => (
        <Panel key={p.key} title={p.title} help={p.help} defaultOpen={p.key === openKey}>
          {p.body}
        </Panel>
      ))}
    </div>
  );
}
