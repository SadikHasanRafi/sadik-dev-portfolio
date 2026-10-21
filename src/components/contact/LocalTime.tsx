"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
};

/** Live wall-clock time in a given time zone (minute precision). */
export default function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => new Date().toLocaleTimeString("en-US", { timeZone, hour: "2-digit", minute: "2-digit" }),
    () => "--:--",
  );
  return <span className="tabular-nums">{time}</span>;
}
