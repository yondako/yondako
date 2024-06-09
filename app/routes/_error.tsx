import Button from "@/components/common/Button";
import LandingLayout from "@/components/landing/Layout";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const handler: ErrorHandler = (err, c) => {
  let reason = "内部でエラーが発生しました";
  let solution = "しばらく時間をおいて再度アクセスしなおしてください 🙇";

  if (err instanceof HTTPException) {
    // const { status } = err.getResponse();
    // TODO: ステータスコードで表示を変えたい場合はここに処理を追加
  } else {
    // NOTE:
    // Auth.js の401エラーが Response 型になっているため、キャストして対応しています
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rawError = err as any as Response;

    if (rawError?.status === 401) {
      reason = "ログインが必要なページです";
      solution = "ログインもしくは新規登録後、再度アクセスしてください";
    }
  }

  return c.render(
    <LandingLayout>
      <div className="max-w-[26rem] text-center">
        <h1 className="font-bold text-4xl lg:text-5xl tracking-wide">Oops!</h1>
        <p className="mt-10">{reason}</p>
        <p className="mt-1">{solution}</p>
        <Button asChild>
          <a className="block mx-auto mt-10 text-base" href="/">
            <span className="font-noto-emoji">🐙</span>
            <span className="ml-2">トップページに戻る</span>
          </a>
        </Button>
      </div>
    </LandingLayout>,
    {
      title: "Oops!",
    },
  );
};

export default handler;
