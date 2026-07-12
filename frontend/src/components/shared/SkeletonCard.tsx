export default function SkeletonCard({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[180px] md:w-[200px]">
          <div className="skeleton aspect-[2/3] rounded-2xl" />
          <div className="mt-3 space-y-2 px-1">
            <div className="skeleton h-4 w-3/4 rounded-lg" />
            <div className="skeleton h-3 w-1/2 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
