"use client";

import { useContext } from "react";
import { UpdateContext } from "@/components/dashboard/AutoForm";
import { DButton, FieldShell, inputClass, Panel, Toggle } from "@/components/dashboard/ui";
import { darkPalette, lightPalette } from "@/content/defaults";
import { cn } from "@/lib/utils";
import type { SiteContent, ThemePalette, ThemeToken } from "@/types";

const groups: { title: string; tokens: { key: ThemeToken; label: string }[] }[] = [
  {
    title: "Surfaces",
    tokens: [
      { key: "bg", label: "Page background" },
      { key: "strip", label: "Alternate band" },
      { key: "paper", label: "Cards & inputs" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { key: "ink", label: "Main text & dark buttons" },
      { key: "muted", label: "Secondary text" },
      { key: "onInk", label: "Text on dark buttons" },
      { key: "line", label: "Borders & dividers" },
    ],
  },
  {
    title: "Accent",
    tokens: [
      { key: "violet", label: "Accent" },
      { key: "lavender", label: "Accent tint (banners)" },
      { key: "lavender2", label: "Second tint" },
      { key: "lavenderDeep", label: "Accent on dark panels" },
      { key: "violetInk", label: "Text on accent tint" },
    ],
  },
  {
    title: "Dark panels",
    tokens: [
      { key: "night", label: "Panel" },
      { key: "night2", label: "Panel, raised" },
      { key: "night3", label: "Panel, tiles" },
      { key: "nightMuted", label: "Panel text" },
      { key: "nightLine", label: "Panel borders" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { key: "ok", label: "Live / success" },
      { key: "alert", label: "Warnings" },
    ],
  },
];

type Accent = Pick<ThemePalette, "violet" | "violetInk" | "lavender" | "lavender2" | "lavenderDeep">;
const presets: { name: string; light: Accent; dark: Accent }[] = [
  {
    name: "Violet",
    light: { violet: "#5b3fa8", violetInk: "#21005e", lavender: "#e9e4fa", lavender2: "#e8ddff", lavenderDeep: "#cebdff" },
    dark: { violet: "#a68cff", violetInk: "#e8ddff", lavender: "#1e1932", lavender2: "#2a2346", lavenderDeep: "#cebdff" },
  },
  {
    name: "Emerald",
    light: { violet: "#0f7a5a", violetInk: "#053d2c", lavender: "#e0f3ec", lavender2: "#cdebdf", lavenderDeep: "#9fe0c4" },
    dark: { violet: "#4fd1a1", violetInk: "#d5f5e9", lavender: "#102a22", lavender2: "#163a2f", lavenderDeep: "#9fe0c4" },
  },
  {
    name: "Ocean",
    light: { violet: "#1f5fbf", violetInk: "#0b2a57", lavender: "#e3ecfa", lavender2: "#d3e1f7", lavenderDeep: "#b7cdf3" },
    dark: { violet: "#78a6ff", violetInk: "#dce8ff", lavender: "#13213a", lavender2: "#1a2c4d", lavenderDeep: "#b7cdf3" },
  },
  {
    name: "Rose",
    light: { violet: "#b0305a", violetInk: "#4a0d22", lavender: "#f8e4eb", lavender2: "#f2d2de", lavenderDeep: "#f0b5c9" },
    dark: { violet: "#ff8fb1", violetInk: "#ffe0ea", lavender: "#2e1520", lavender2: "#3d1c2b", lavenderDeep: "#f0b5c9" },
  },
  {
    name: "Amber",
    light: { violet: "#a35a00", violetInk: "#3f2300", lavender: "#f8ecd9", lavender2: "#f2dfc0", lavenderDeep: "#f0c98a" },
    dark: { violet: "#ffb547", violetInk: "#ffeccc", lavender: "#2c2010", lavender2: "#3a2a15", lavenderDeep: "#f0c98a" },
  },
  {
    name: "Graphite",
    light: { violet: "#3a3a3a", violetInk: "#111111", lavender: "#ececec", lavender2: "#e2e2e2", lavenderDeep: "#cfcfcf" },
    dark: { violet: "#e0e0e0", violetInk: "#f5f5f5", lavender: "#222226", lavender2: "#2c2c31", lavenderDeep: "#d0d0d0" },
  },
];

const HEX = /^#[0-9a-f]{6}$/i;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/deg]+\))$/i;

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const valid = COLOR.test(value.trim());
  return (
    <div className="flex items-center gap-3">
      <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden border border-line" style={{ background: valid ? value : "transparent" }}>
        <span className="sr-only">{label} colour picker</span>
        <input
          type="color"
          value={HEX.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-[0.78rem] text-ink">{label}</span>
        <input
          value={value}
          spellCheck={false}
          aria-label={`${label} value`}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-transparent font-mono text-[0.75rem] text-muted focus:text-ink focus:outline-none",
            !valid && "text-alert",
          )}
        />
      </div>
    </div>
  );
}

/** A miniature of the site drawn with the palette, so changes are visible before saving. */
function Preview({ p, name }: { p: ThemePalette; name: string }) {
  return (
    <div className="border" style={{ background: p.bg, borderColor: p.line, color: p.ink }}>
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: p.line }}>
        <span className="font-serif text-[0.95rem] font-bold">SR</span>
        <span className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: p.muted }}>
          {name} preview
        </span>
      </div>
      <div className="p-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em]" style={{ color: p.violet }}>
          Featured work
        </p>
        <p className="mt-1 font-serif text-[1.35rem] leading-tight">
          Quietly powering <em style={{ color: p.violet }}>real businesses.</em>
        </p>
        <p className="mt-1 text-[0.72rem]" style={{ color: p.muted }}>
          Secondary text reads like this.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em]" style={{ background: p.ink, color: p.onInk }}>
            Button
          </span>
          <span className="px-2 py-1 font-mono text-[0.62rem]" style={{ background: p.lavender, color: p.violet }}>
            accent tag
          </span>
          <span className="border px-2 py-1 font-mono text-[0.62rem]" style={{ background: p.paper, borderColor: p.line, color: p.muted }}>
            card
          </span>
        </div>
        <div className="mt-3 p-3" style={{ background: p.night, border: `1px solid ${p.nightLine}` }}>
          <p className="font-mono text-[0.62rem]" style={{ color: p.nightMuted }}>
            &gt; dark panel text
          </p>
          <p className="font-mono text-[0.62rem]" style={{ color: p.lavenderDeep }}>
            &gt; accent on dark · <span style={{ color: p.ok }}>live</span>
          </p>
        </div>
        <div className="mt-3 px-3 py-2 text-[0.7rem]" style={{ background: p.lavender, color: p.violetInk }}>
          Closing banner band
        </div>
      </div>
    </div>
  );
}

export default function ThemeEditor({ content }: { content: SiteContent }) {
  const update = useContext(UpdateContext);
  const theme = content.theme;

  const applyPreset = (preset: (typeof presets)[number]) => {
    update("theme", { ...theme, light: { ...theme.light, ...preset.light }, dark: { ...theme.dark, ...preset.dark } });
  };

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Mode" help="What visitors see first, and whether they can switch.">
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-2">
          <FieldShell label="Default theme" htmlFor="theme-mode">
            <select
              id="theme-mode"
              className={cn(inputClass, "appearance-none")}
              value={theme.defaultMode}
              onChange={(e) => update("theme.defaultMode", e.target.value)}
            >
              <option value="system">Follow the visitor’s device</option>
              <option value="light">Always start light</option>
              <option value="dark">Always start dark</option>
            </select>
          </FieldShell>
          <Toggle checked={theme.allowToggle} onChange={(v) => update("theme.allowToggle", v)} label="Show the light / dark switch" />
        </div>
      </Panel>

      <Panel title="Accent presets" help="Quick starting points. They change only the accent colours, in both themes.">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="group flex items-center gap-2.5 border border-line bg-bg px-3 py-2 text-[0.82rem] text-ink transition-colors hover:border-ink"
            >
              <span className="flex">
                <span className="size-4" style={{ background: preset.light.violet }} />
                <span className="size-4" style={{ background: preset.light.lavender }} />
                <span className="size-4" style={{ background: preset.dark.violet }} />
              </span>
              {preset.name}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {(["light", "dark"] as const).map((mode) => (
          <Panel
            key={mode}
            title={mode === "light" ? "Light theme" : "Dark theme"}
            right={
              <DButton size="sm" variant="ghost" onClick={() => update(`theme.${mode}`, mode === "light" ? lightPalette : darkPalette)}>
                Reset
              </DButton>
            }
          >
            <Preview p={theme[mode]} name={mode} />
            <div className="mt-6 flex flex-col gap-6">
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-muted">{g.title}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {g.tokens.map((t) => (
                      <ColorRow key={t.key} label={t.label} value={theme[mode][t.key]} onChange={(v) => update(`theme.${mode}.${t.key}`, v)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
