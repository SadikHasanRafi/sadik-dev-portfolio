import Skeleton, { IntroSkeleton, LoadingRegion } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingRegion label="Loading work">
      <IntroSkeleton />
      <section className="border-b border-line bg-strip py-14 md:py-20">
        <div className="container-page flex flex-col gap-10 md:gap-14">
          <div className="flex gap-2">
            {[16, 24, 28, 20].map((w, i) => (
              <Skeleton key={i} className="h-9" style={{ width: `${w * 4}px` }} />
            ))}
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-8 border border-line bg-paper p-6 md:grid-cols-2 md:p-8">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="flex flex-col justify-center">
                <Skeleton className="mb-5 h-3 w-24" />
                <Skeleton className="mb-4 h-8 w-4/5" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-6 h-4 w-3/4" />
                <Skeleton className="h-11 w-40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </LoadingRegion>
  );
}
