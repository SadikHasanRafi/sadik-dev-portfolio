import Skeleton, { LoadingRegion } from "@/components/ui/Skeleton";

/** Dashboard shell placeholder: sidebar + editor panel. */
export default function Loading() {
  return (
    <LoadingRegion label="Loading dashboard">
      <div className="flex min-h-screen bg-bg">
        <aside className="hidden w-64 shrink-0 flex-col gap-3 border-r border-line bg-strip p-5 md:flex">
          <Skeleton className="mb-4 h-8 w-32" />
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </aside>
        <div className="flex-1 p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="flex max-w-3xl flex-col gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}
