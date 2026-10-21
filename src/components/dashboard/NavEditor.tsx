"use client";

import { useContext } from "react";
import { UpdateContext } from "@/components/dashboard/AutoForm";
import { SortableList, useRowIds } from "@/components/dashboard/Sortable";
import { FieldShell, inputClass, Panel, Toggle } from "@/components/dashboard/ui";
import { pageHref } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { PageKey, SiteContent } from "@/types";

/** Menu order + labels, page on/off switches and the header button. */
export default function NavEditor({ content }: { content: SiteContent }) {
  const update = useContext(UpdateContext);
  const nav = content.navigation;
  const { ids, setIds } = useRowIds(nav.items.length);

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Menu & pages" help="Drag to change the menu order. Switching a page off hides it everywhere and makes its URL return “not found”.">
        <SortableList
          items={nav.items}
          ids={ids}
          setIds={setIds}
          onReorder={(items) => update("navigation.items", items)}
          renderRow={(item, i, handle) => {
            const isHome = item.id === "home";
            const on = isHome || nav.pages[item.id as PageKey];
            return (
              <div className={cn("flex flex-wrap items-center gap-3 border border-line bg-paper py-1.5 pl-1 pr-3", !on && "bg-strip")}>
                {handle}
                <input
                  value={item.label}
                  aria-label={`Menu label for ${item.id}`}
                  onChange={(e) => update(`navigation.items.${i}.label`, e.target.value)}
                  className={cn(inputClass, "w-40 flex-1 py-2 sm:max-w-xs")}
                />
                <span className="hidden font-mono text-[0.75rem] text-muted sm:inline">{pageHref[item.id]}</span>
                <span className="ml-auto">
                  {isHome ? (
                    <span className="text-[0.75rem] text-muted">Always on</span>
                  ) : (
                    <Toggle checked={on} onChange={(v) => update(`navigation.pages.${item.id}`, v)} label={on ? "Page on" : "Page off"} />
                  )}
                </span>
              </div>
            );
          }}
        />
      </Panel>

      <Panel title="Header button" help="Opens the “Let’s Talk” popup.">
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-2">
          <FieldShell label="Button text" htmlFor="nav-cta">
            <input id="nav-cta" className={inputClass} value={nav.cta.label} onChange={(e) => update("navigation.cta.label", e.target.value)} />
          </FieldShell>
          <Toggle checked={nav.cta.visible} onChange={(v) => update("navigation.cta.visible", v)} label="Show the button" />
        </div>
      </Panel>
    </div>
  );
}
