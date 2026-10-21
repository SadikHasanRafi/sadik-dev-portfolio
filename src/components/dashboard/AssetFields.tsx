"use client";

import { useId, useRef, useState } from "react";
import { DButton, DIcon, FieldShell, inputClass } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import type { FileAsset, ImageAsset } from "@/types";

async function upload(file: File) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/dashboard/upload/", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
  return data as { src: string; width?: number; height?: number; name?: string };
}

/** Shared drop zone: click to browse or drop a file on it. */
function DropZone({
  accept,
  onFile,
  busy,
  children,
}: {
  accept: string;
  onFile: (file: File) => void;
  busy: boolean;
  children: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      className={cn(
        "relative border border-dashed transition-colors duration-200",
        over ? "border-violet bg-lavender/40" : "border-line bg-bg",
        busy && "pointer-events-none opacity-60",
      )}
    >
      {children}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-line px-3 py-2.5">
        <span className="text-[0.75rem] text-muted">{busy ? "Uploading…" : "Drop a file here or"}</span>
        <DButton size="sm" onClick={() => input.current?.click()} disabled={busy}>
          <DIcon name="upload" className="size-3.5" /> Choose file
        </DButton>
      </div>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function ImageField({
  label,
  help,
  value,
  nullable,
  onChange,
}: {
  label: string;
  help?: string;
  value: ImageAsset | null;
  nullable: boolean;
  onChange: (v: ImageAsset | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const altId = useId();

  const onFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const res = await upload(file);
      if (!res.width || !res.height) throw new Error("Please choose an image file");
      onChange({ src: res.src, width: res.width, height: res.height, alt: value?.alt ?? "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FieldShell
      label={label}
      help={help}
      aside={
        nullable && value ? (
          <button type="button" onClick={() => onChange(null)} className="text-[0.75rem] text-muted underline-offset-4 hover:text-alert hover:underline">
            Remove
          </button>
        ) : undefined
      }
    >
      <DropZone accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onFile={onFile} busy={busy}>
        <div className="flex items-center gap-4 p-3">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden border border-line bg-[repeating-conic-gradient(var(--color-strip)_0_25%,var(--color-paper)_0_50%)] bg-[length:12px_12px]">
            {value?.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- previews of fresh uploads
              <img src={value.src} alt="" className="max-h-full max-w-full object-contain" />
            ) : (
              <DIcon name="image" className="size-6 text-muted" />
            )}
          </div>
          <div className="min-w-0 text-[0.78rem] text-muted">
            {value?.src ? (
              <>
                <p className="truncate font-mono text-ink">{value.src.split("/").pop()}</p>
                <p>
                  {value.width} × {value.height}px
                </p>
              </>
            ) : (
              <p>No image yet.</p>
            )}
          </div>
        </div>
      </DropZone>
      {error && <p className="text-[0.75rem] text-alert">{error}</p>}
      {value && (
        <input
          id={altId}
          className={cn(inputClass, "mt-1")}
          value={value.alt}
          placeholder="Describe the image (for screen readers)"
          aria-label={`${label} description`}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
        />
      )}
    </FieldShell>
  );
}

export function FileField({ label, help, value, onChange }: { label: string; help?: string; value: FileAsset; onChange: (v: FileAsset) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const res = await upload(file);
      if (res.width) throw new Error("Please choose a PDF");
      onChange({ src: res.src, name: res.name ?? file.name });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FieldShell label={label} help={help}>
      <DropZone accept="application/pdf" onFile={onFile} busy={busy}>
        <div className="flex items-center gap-3 p-3">
          <span className="flex size-10 shrink-0 items-center justify-center border border-line bg-paper text-violet">
            <DIcon name="file" />
          </span>
          <div className="min-w-0 flex-1 text-[0.8rem]">
            <p className="truncate text-ink">{value.name || "No file"}</p>
            {value.src && (
              <a href={value.src} target="_blank" rel="noreferrer" className="text-[0.75rem] text-muted underline-offset-4 hover:text-violet hover:underline">
                Open current file ↗
              </a>
            )}
          </div>
        </div>
      </DropZone>
      {error && <p className="text-[0.75rem] text-alert">{error}</p>}
    </FieldShell>
  );
}
