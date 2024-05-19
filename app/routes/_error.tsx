import Button from "@/components/common/Button";
import LandingLayout from "@/components/landing/Layout";
import type { ErrorHandler } from "hono";

const handler: ErrorHandler = (err, c) => {
  console.error(err);

  return c.render(
    <LandingLayout>
      <div className="max-w-[26rem] text-center">
        <h1 className="font-bold text-4xl lg:text-5xl tracking-wide">Error!</h1>
        <p className="mt-10">内部でエラーが発生しました</p>
        <p className="mt-1 break-keep">
          しばらく
          <wbr />
          時間
          <wbr />
          おいて
          <wbr />
          再度アクセス
          <wbr />
          しなおしてください 🙇
        </p>
        <Button asChild>
          <a className="block mx-auto mt-10 text-base" href="/">
            <span className="font-noto-emoji">🐙</span>
            <span className="ml-2">トップページに戻る</span>
          </a>
        </Button>
      </div>
    </LandingLayout>,
  );
};

export default handler;
