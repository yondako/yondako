import { expect, mock, test } from "bun:test";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

mock.module("@/components/Loading", () => ({
  Loading: ({ title }: { title: string }) => <p>{title}</p>,
}));

test("3秒で文言が変わり、表示の引き継ぎでは継続し、再検索では最初に戻る", async () => {
  const { SearchFeedbackProvider, SearchLoading, useSearchStart } = await import(".");
  function Search() {
    const start = useSearchStart();
    const [key, setKey] = useState(0);
    return (
      <>
        <button type="button" onClick={start}>
          検索
        </button>
        <button type="button" onClick={() => setKey(key + 1)}>
          表示を引き継ぐ
        </button>
        <SearchLoading key={key} />
      </>
    );
  }

  render(
    <SearchFeedbackProvider>
      <Search />
    </SearchFeedbackProvider>,
  );
  fireEvent.click(screen.getByText("検索", { exact: true }));
  expect(screen.getByRole("status").textContent).toBe("検索しています");
  await act(async () => {
    await Bun.sleep(3100);
  });
  expect(screen.getByRole("status").textContent).toBe("がんばって検索しています");
  fireEvent.click(screen.getByText("表示を引き継ぐ"));
  expect(screen.getByRole("status").textContent).toBe("がんばって検索しています");
  fireEvent.click(screen.getByText("検索", { exact: true }));
  expect(screen.getByRole("status").textContent).toBe("検索しています");
});

test("フォーム送信後も待機時間を引き継ぎ、次の待機表示は最初から始まる", async () => {
  const { SearchFeedbackProvider, SearchFormStatus, SearchLoading, SearchResults, useSearchStart } = await import(".");
  let completeSubmission = () => {};
  const submission = new Promise<void>((resolve) => {
    completeSubmission = resolve;
  });

  function Search() {
    const start = useSearchStart();
    const [page, setPage] = useState(0);
    return (
      <>
        <form
          aria-label="検索フォーム"
          onSubmit={start}
          action={async () => {
            await submission;
            setPage(1);
          }}
        >
          <SearchFormStatus />
          <button type="submit">検索</button>
        </form>
        <button type="button" onClick={() => setPage(2)}>
          次のページ
        </button>
        <SearchResults>{page ? <SearchLoading key={page} /> : <p>前の結果</p>}</SearchResults>
      </>
    );
  }

  render(
    <SearchFeedbackProvider>
      <Search />
    </SearchFeedbackProvider>,
  );
  await act(async () => {
    fireEvent.submit(screen.getByRole("form", { name: "検索フォーム" }));
  });
  expect(screen.getByRole("status").textContent).toBe("検索しています");
  await act(async () => {
    await Bun.sleep(3100);
  });
  expect(screen.getByRole("status").textContent).toBe("がんばって検索しています");
  await act(async () => {
    completeSubmission();
  });
  expect(screen.getAllByRole("status")).toHaveLength(1);
  expect(screen.getByRole("status").textContent).toBe("がんばって検索しています");
  await act(async () => {
    await Bun.sleep(3100);
  });
  expect(screen.getByRole("status").textContent).toBe("時間がかかっています……");
  fireEvent.click(screen.getByText("次のページ"));
  expect(screen.getByRole("status").textContent).toBe("検索しています");
}, 10_000);
