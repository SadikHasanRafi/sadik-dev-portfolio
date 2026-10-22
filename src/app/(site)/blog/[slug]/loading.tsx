import Skeleton, { LoadingRegion } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Loading article">
      <article className="container-page max-w-3xl py-14 md:py-20">
        <Skeleton className="mb-6 h-3 w-32" />
        <Skeleton className="mb-3 h-10 w-full sm:h-12" />
        <Skeleton className="mb-8 h-10 w-3/4 sm:h-12" />
        <Skeleton className="mb-12 h-3 w-48" />
        <Skeleton className="mb-12 aspect-[16/9] w-full" />
        <div className="flex flex-col gap-3">
          {["w-full", "w-full", "w-11/12", "w-full", "w-2/3", "w-full", "w-5/6"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
      </article>
    </LoadingRegion>
  );
}
