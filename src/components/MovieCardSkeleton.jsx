const MovieCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-neutral-800">
      <div className="aspect-[2/3] w-full bg-neutral-700" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-neutral-700" />
        <div className="h-3 w-1/2 rounded bg-neutral-700" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
