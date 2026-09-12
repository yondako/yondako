export default function Loading() {
  return (
    <div>
      <output className="sr-only">お知らせを読み込み中</output>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index.toString()}
            className="flex animate-pulse items-center space-x-6 rounded-2xl bg-tertiary-background p-8"
          >
            <div className="h-10 w-10 shrink-0 rounded bg-primary-foreground/20 lg:h-12 lg:w-12" />
            <div className="w-full space-y-2">
              <div className="h-6 w-full rounded bg-primary-foreground/20" />
              <div className="h-4 w-2/3 rounded bg-secondary-foreground/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
