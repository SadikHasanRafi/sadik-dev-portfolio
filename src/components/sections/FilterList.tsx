"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn, delay } from "@/lib/utils";

export type FilterItem = {
  id: string;
  tags: string[];
  /** Lower-cased text the search box matches against */
  text?: string;
  node: React.ReactNode;
};

type Props = {
  filters: { id: string; label: string }[];
  items: FilterItem[];
  /** Show a search input next to the filter chips */
  search?: { placeholder: string };
  className?: string;
  listClassName?: string;
  empty?: string;
};

/**
 * Filter chips (+ optional search) over server-rendered items. Only the chip state
 * lives on the client; the item markup is rendered at build time.
 */
export default function FilterList({ filters, items, search, className, listClassName, empty = "Nothing matches yet." }: Props) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (item) => (active === "all" || item.tags.includes(active)) && (!q || item.text?.includes(q)),
  );
  const count = (id: string) => (id === "all" ? items.length : items.filter((i) => i.tags.includes(id)).length);

  return (
    <div className={className}>
      <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="-mx-1 flex flex-wrap gap-2 px-1" role="group" aria-label="Filter">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              aria-pressed={active === f.id}
              className={cn(
                "label-caps px-4 py-3 tracking-[0.14em] transition-colors duration-300",
                active === f.id ? "bg-ink text-on-ink" : "bg-strip text-muted hover:bg-line hover:text-ink",
              )}
            >
              {f.label} <span className="ml-1 font-mono opacity-60">({count(f.id)})</span>
            </button>
          ))}
        </div>
        {search && (
          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Search</span>
            <Icon name="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={search.placeholder}
              className="w-full border border-line bg-paper py-3 pl-10 pr-4 text-body-sm text-ink placeholder:text-muted/70 focus:border-violet focus:outline-none"
            />
          </label>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "result" : "results"}
      </p>
      <div className={listClassName}>
        {visible.map((item, i) => (
          <div key={`${active}-${item.id}`} className="item-enter" style={delay(Math.min(i, 6) * 70)}>
            {item.node}
          </div>
        ))}
        {visible.length === 0 && <p className="col-span-full py-16 text-center text-body-md text-muted">{empty}</p>}
      </div>
    </div>
  );
}
