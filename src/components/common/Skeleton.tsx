interface SkeletonProps {
  className?: string;
  count?: number;
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <div className="mb-3 h-32 animate-pulse rounded-xl bg-cyber-border" />
          <div className="mb-2 h-4 animate-pulse rounded bg-cyber-border" />
          <div className="mb-3 h-3 animate-pulse rounded bg-cyber-border w-2/3" />
          <div className="h-8 animate-pulse rounded-lg bg-cyber-border" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card flex gap-4 p-4">
          <div className="h-28 w-44 shrink-0 animate-pulse rounded-xl bg-cyber-border" />
          <div className="flex-1">
            <div className="mb-2 h-4 animate-pulse rounded bg-cyber-border w-1/3" />
            <div className="mb-2 h-5 animate-pulse rounded bg-cyber-border w-2/3" />
            <div className="h-3 animate-pulse rounded bg-cyber-border w-full" />
          </div>
          <div className="h-12 w-24 shrink-0 animate-pulse rounded-xl bg-cyber-border" />
        </div>
      ))}
    </div>
  );
}

export function Skeleton({ className = "", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded bg-cyber-border ${className}`}
        />
      ))}
    </>
  );
}
