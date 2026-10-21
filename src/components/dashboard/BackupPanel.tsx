"use client";

import { useRef, useState } from "react";
import { DButton, DIcon, Panel } from "@/components/dashboard/ui";
import { defaultContent } from "@/content/defaults";
import { mergeWithDefaults } from "@/lib/merge";
import type { SiteContent } from "@/types";

export default function BackupPanel({ content, onReplace }: { content: SiteContent; onReplace: (c: SiteContent) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      onReplace(mergeWithDefaults(defaultContent, parsed));
      setMessage("Imported. Review it, then press Save to publish.");
    } catch {
      setMessage("That file isn't valid JSON.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Backup" help="Download everything you've written as one JSON file, or load a previous backup.">
        <div className="flex flex-wrap gap-3">
          <DButton onClick={exportJson}>
            <DIcon name="upload" className="size-4 rotate-180" /> Download backup
          </DButton>
          <DButton onClick={() => input.current?.click()}>
            <DIcon name="upload" className="size-4" /> Load a backup…
          </DButton>
          <input
            ref={input}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
        </div>
        {message && <p className="mt-3 text-[0.8rem] text-muted">{message}</p>}
        <p className="mt-4 text-[0.75rem] text-muted">Uploaded images and PDFs aren&apos;t inside the backup file; they stay in MongoDB (GridFS). Every save is also kept in the database&apos;s history — the last 30 versions.</p>
      </Panel>

      <Panel title="Start over" help="Puts every text, image and setting back to how the site shipped. Nothing changes until you press Save.">
        <DButton
          variant="danger"
          onClick={() => {
            if (window.confirm("Reset the whole site to its original content? You can still discard before saving.")) {
              onReplace(structuredClone(defaultContent));
              setMessage(null);
            }
          }}
        >
          Reset everything to defaults
        </DButton>
      </Panel>
    </div>
  );
}
