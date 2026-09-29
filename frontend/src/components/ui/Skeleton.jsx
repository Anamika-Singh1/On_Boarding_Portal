import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`} />
);

// Mimics the shape of the card grids used across Mentors/Interns/Events/etc.
// so the loading state doesn't cause a layout jump once real data arrives.
export const CardGridSkeleton = ({ count = 4 }) => (
  <div className="grid gap-6 md:grid-cols-2" role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-4 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
