export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-lg lg:mx-0">
      <output className="sr-only">アカウント削除ページを読み込み中</output>
      <div aria-hidden="true">
        <h2 className="font-bold text-2xl">アカウントの削除</h2>
        <div className="mt-4 animate-pulse space-y-2">
          <div className="h-4 w-full rounded bg-primary-foreground/20" />
          <div className="h-4 w-2/3 rounded bg-primary-foreground/20" />
          <div className="mt-4 h-4 w-4/5 rounded bg-primary-foreground/20" />
        </div>
        <div className="mt-6 h-9 animate-pulse rounded-full bg-tertiary-background lg:max-w-96" />
        <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-tertiary-background lg:w-64" />
      </div>
    </div>
  );
}
