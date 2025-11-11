const SkeletonComment = () => {
  return (
    <div className="w-full py-3 border-b border-zinc-800">
      <div className="h-3 w-24 rounded bg-zinc-800/60 animate-pulse mb-2" />
      <div className="h-3 w-4/5 rounded bg-zinc-800/60 animate-pulse" />
    </div>
  );
};

export default SkeletonComment;
