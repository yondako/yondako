import Button from "@/components/common/Button";
import LandingLayout from "@/components/landing/Layout";
import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
  return c.render(
    <LandingLayout>
      <div className="max-w-[26rem] text-center">
        <h1 className="font-bold text-4xl lg:text-5xl tracking-wide">
          NotFound
        </h1>
        <p className="mt-10">ページが見つかりませんでした 🫥</p>
        <p className="mt-1">URLが間違っていないかご確認ください</p>
        <Button asChild>
          <a className="block mx-auto mt-10 text-base" href="/">
            <span className="font-noto-emoji">🐙</span>
            <span className="ml-2">トップページに戻る</span>
          </a>
        </Button>
      </div>
    </LandingLayout>,
    {
      title: "NotFound",
    },
  );
};

export default handler;
