import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "loading-skeleton rounded-lg",
        className
      )}
    />
  );
}

// Specific skeleton components for common patterns
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden">
      <LoadingSkeleton className="w-full h-48" />
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-5 w-20" />
          <LoadingSkeleton className="h-5 w-12" />
        </div>
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-16 w-full" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <LoadingSkeleton className="h-9 flex-1" />
          <LoadingSkeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <LoadingSkeleton className="w-full aspect-square rounded-xl" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LoadingSkeleton className="h-6 w-20" />
            <LoadingSkeleton className="h-6 w-16" />
          </div>
          <LoadingSkeleton className="h-8 w-3/4" />
          <LoadingSkeleton className="h-6 w-1/2" />
        </div>
        
        <LoadingSkeleton className="h-32 w-full rounded-xl" />
        
        <div className="space-y-4">
          <LoadingSkeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton className="h-12 w-full" />
            <LoadingSkeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategorySidebarSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-6 w-24" />
      
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <LoadingSkeleton className="h-5 w-32" />
            <LoadingSkeleton className="h-5 w-8" />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-28" />
        <LoadingSkeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <LoadingSkeleton className="h-4 w-8" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <LoadingSkeleton className="lg:col-span-2 h-80 rounded-xl" />
        <LoadingSkeleton className="h-80 rounded-xl" />
      </div>
      
      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LoadingSkeleton className="h-96 rounded-xl" />
        <LoadingSkeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}
