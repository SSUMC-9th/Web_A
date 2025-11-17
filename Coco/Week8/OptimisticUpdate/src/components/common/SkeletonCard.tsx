// components/common/SkeletonCard.tsx
export const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-64 overflow-hidden">
      <div className="h-40 bg-gray-300" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-gray-300 rounded w-16" />
          <div className="h-3 bg-gray-300 rounded w-16" />
        </div>
      </div>
    </div>
  );
};