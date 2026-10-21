"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { DIcon } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";

let counter = 0;
/** Unique id for a list row (module counter, so it's stable across renders). */
export const nextId = () => `row-${++counter}`;

/** Stable ids for list rows, so editing a row never remounts it; ids move with their rows. */
export function useRowIds(length: number) {
  const [ids, setIds] = useState<string[]>(() => Array.from({ length }, nextId));
  // Keep ids aligned when rows are added/removed from outside (import, discard…)
  if (ids.length !== length) {
    const next = ids.length > length ? ids.slice(0, length) : [...ids, ...Array.from({ length: length - ids.length }, nextId)];
    setIds(next);
    return { ids: next, setIds };
  }
  return { ids, setIds };
}

type ListProps<T> = {
  items: T[];
  ids: string[];
  setIds: (ids: string[]) => void;
  onReorder: (items: T[]) => void;
  renderRow: (item: T, index: number, handle: React.ReactNode) => React.ReactNode;
  className?: string;
};

/** Drag-to-reorder list (mouse, touch and keyboard). */
export function SortableList<T>({ items, ids, setIds, onReorder, renderRow, className }: ListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    setIds(arrayMove(ids, from, to));
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={cn("flex flex-col gap-2", className)}>
          {items.map((item, i) => (
            <SortableRow key={ids[i]} id={ids[i]}>
              {(handle) => renderRow(item, i, handle)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: (handle: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      title="Drag to reorder"
      className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center text-muted transition-colors hover:text-ink active:cursor-grabbing"
    >
      <DIcon name="grip" />
    </button>
  );
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative", isDragging && "z-10 opacity-90 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)]")}
    >
      {children(handle)}
    </li>
  );
}
