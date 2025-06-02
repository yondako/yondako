export default function BookCardSkeleton() {
  return (
    <div className="@container relative mt-8 w-full text-left">
      <div className="flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl bg-tertiary-background p-4 pl-36">
        <div className="space-y-1">
          {/* タイトルのスケルトン */}
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>

          {/* 著者のスケルトン */}
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* ステータスボタンのスケルトン */}
      <div className="absolute bottom-4 left-36">
        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
      </div>

      {/* サムネイルのスケルトン */}
      <div className="-top-4 pointer-events-none absolute left-4 h-full w-28 animate-pulse rounded border-4 border-tertiary-background bg-muted shadow-xl" />
    </div>
  );
}
