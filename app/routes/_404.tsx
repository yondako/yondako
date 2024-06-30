import Button from "@/components/common/Button";
import LandingLayout from "@/components/landing/Layout";
import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
  return c.render(
    <LandingLayout>
      <h1 className="font-bold text-4xl lg:text-5xl tracking-wide">NotFound</h1>
      <p className="mt-10">ページが見つかりませんでした 🫥</p>
      <p className="mt-1">URLが間違っていないかご確認ください</p>
      <Button asChild>
        <a className="w-fit block mt-10 text-base mx-auto md:mx-0" href="/">
          <span className="font-noto-emoji">🐙</span>
          <span className="ml-2">トップページに戻る</span>
        </a>
      </Button>
    </LandingLayout>,
    {
      title: "NotFound",
    },
  );
};

export default handler;
