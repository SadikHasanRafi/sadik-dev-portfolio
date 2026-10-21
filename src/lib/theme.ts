import { themeTokens, type SiteContent, type ThemePalette } from "@/types";

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/deg]+\))$/i;

const cssVar = (token: string) => `--t-${token.replace(/[A-Z0-9]/g, (c) => `-${c.toLowerCase()}`)}`;

function declarations(palette: ThemePalette) {
  return themeTokens
    .filter((t) => COLOR.test(palette[t]?.trim() ?? ""))
    .map((t) => `${cssVar(t)}:${palette[t].trim()}`)
    .join(";");
}

/** CSS custom properties for both palettes. Values are validated so content can't inject CSS. */
export function themeCss(theme: SiteContent["theme"]) {
  return `html:root{${declarations(theme.light)}}html:root[data-theme="dark"]{${declarations(theme.dark)}}`;
}

/** Runs before first paint: applies the saved / system theme so there is no flash. */
export function themeScript(theme: SiteContent["theme"]) {
  const mode = JSON.stringify(["light", "dark"].includes(theme.defaultMode) ? theme.defaultMode : "system");
  return `(function(){var d=document.documentElement,m=${mode},s=null;try{s=localStorage.getItem("theme")}catch(e){}if(${theme.allowToggle === true}&&(s==="light"||s==="dark"))m=s;if(m==="system")m=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=m})();`;
}
