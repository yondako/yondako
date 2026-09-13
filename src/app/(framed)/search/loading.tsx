export default function Loading() {
  return (
    <div>
      <output className="sr-only">検索ページを読み込み中</output>
      <div aria-hidden="true" inert>
        <div className="flex flex-col items-end lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <div className="h-9 w-full animate-pulse rounded-full bg-tertiary-background md:w-36" />
            <div className="h-9 grow animate-pulse rounded-full bg-tertiary-background" />
          </div>
          <div className="mt-4 h-4 w-28 shrink-0 animate-pulse rounded bg-tertiary-background lg:mt-0 lg:ml-4" />
        </div>
      </div>
    </div>
  );
}
