import { ErrorHandler } from "hono";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";
import LandingPageLayout from "../components/layout/LandingPage";
import { site } from "../libs/constants";

const handler: ErrorHandler = (err, c) => {
  console.error(err);

  return c.render(
    <LandingPageLayout>
      <div className="max-w-[26rem] text-center">
        <h1 className="font-bold text-4xl md:text-5xl tracking-wide">Error!</h1>
        <p className="mt-10">内部でエラーが発生しました</p>
        <p className="mt-1 break-keep">
          しばらく
          <wbr />
          時間
          <wbr />
          おいてから、
          <wbr />
          再度アクセス
          <wbr />
          してください 🙇
        </p>
        <Button asChild>
          <a className="block mx-auto mt-10 text-base" href="/">
            <span className="font-noto-emoji">🐙</span>
            <span className="ml-2">トップページに戻る</span>
          </a>
        </Button>
      </div>
      <Footer className="fixed inset-x-0 bottom-8" />
    </LandingPageLayout>,
    {
      title: `Error! | ${site.name}`,
    },
  );
};

export default handler;
