const SkeletonCard = () => {
  return (
    <div className="w-full">
      <div className="aspect-square w-full rounded-md bg-zinc-800/60 animate-pulse" />
      <div className="h-3 w-4/5 mt-2 rounded bg-zinc-800/60 animate-pulse" />
    </div>
  );
};

export default SkeletonCard;
