/** Reusable skeleton primitives for dashboard loading states. */

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function HeroStatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-8 w-32 mt-2" />
          <SkeletonText className="h-3 w-40 mt-1" />
        </div>
        <SkeletonBox className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <SkeletonText className="h-4 w-36 mb-5" />
      <div className="flex items-center gap-6">
        <SkeletonBox className="w-40 h-40 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonText key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgressCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <SkeletonText className="h-4 w-3/4" />
      <SkeletonBox className="h-2 w-full" />
      <div className="flex justify-between">
        <SkeletonText className="h-3 w-20" />
        <SkeletonText className="h-3 w-10" />
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <SkeletonBox className="w-14 h-5 rounded flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-3 w-32" />
      </div>
    </div>
  );
}
