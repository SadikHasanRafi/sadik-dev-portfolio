import Skeleton, { IntroSkeleton, LoadingRegion } from "@/components/ui/Skeleton";

/** Shown inside the site chrome while any public page streams in. */
export default function Loading() {
  return (
    <LoadingRegion label="Loading page">
      <IntroSkeleton />
      <section className="border-b border-line bg-strip py-14 md:py-20">
        <div className="container-page grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-line bg-paper p-7">
              <Skeleton className="mb-6 size-11" />
              <Skeleton className="mb-3 h-3 w-20" />
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="mb-2 h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </LoadingRegion>
  );
}
