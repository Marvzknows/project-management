import { Skeleton } from "@/components/ui/skeleton";

const BoardPageSkeleton = () => {
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header section */}
      {/* <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div> */}

      {/* Board lists area */}
      <div className="flex-1 min-h-0">
        <div className="relative flex gap-1.5 overflow-x-auto h-full pb-2 p-2.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 w-64 rounded-lg shadow-sm bg-card border border-border"
            >
              <Skeleton className="h-6 w-3/4 rounded-md" />
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ))}
          {/* Add new board list button */}
          <div className="flex flex-col justify-center items-center w-64 rounded-lg border-dashed border-2 border-border bg-muted/20">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPageSkeleton;
