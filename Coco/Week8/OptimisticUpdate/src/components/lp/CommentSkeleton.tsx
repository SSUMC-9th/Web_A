// components/lp/CommentSkeleton.tsx
export const CommentSkeleton = () => {
  return (
    <div className="animate-pulse border-b border-gray-200 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-3 bg-gray-300 rounded w-32" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />
      </div>
    </div>
  );
};