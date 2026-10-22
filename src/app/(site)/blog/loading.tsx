import Skeleton, { IntroSkeleton, LoadingRegion } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Loading posts">
      <IntroSkeleton />
      <section className="border-b border-line bg-strip py-14 md:py-20">
        <div className="container-page grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border border-line bg-paper">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-6">
                <Skeleton className="mb-4 h-3 w-28" />
                <Skeleton className="mb-3 h-6 w-full" />
                <Skeleton className="mb-2 h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </LoadingRegion>
  );
}
