import { createRoute } from "honox/factory";
import logoUrl from "../assets/images/logo_portrait.svg";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";
import { site } from "../libs/constants";

export default createRoute((c) => {
  return c.render(
    <>
      <div className="flex justify-center items-center h-full p-8 bg-gradation bg-left-top bg-no-repeat bg-[length:80%] md:bg-[length:50%]">
        <div className="max-w-[26rem]">
          <img className="m-auto" width={256} src={logoUrl} alt={site.name} />
          <h1 className="mt-10 text-3xl md:text-4xl tracking-wide text-center">
            {site.description.short}
          </h1>
          <p className="mt-6">{site.description.long}</p>
          <Button asChild>
            <a className="block mx-auto mt-10 text-base" href="/">
              <span className="font-noto-emoji">🐙</span>
              <span className="ml-2">新規登録 or ログイン</span>
            </a>
          </Button>
        </div>
      </div>
      <Footer className="fixed inset-x-0 bottom-8" />
    </>,
    {
      title: `${site.name} | ${site.description.short}`,
    },
  );
});
