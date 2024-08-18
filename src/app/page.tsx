import imageLogo from "@/assets/images/logo_portrait.svg?url";
import OpenDoodlesReadingSide from "@/assets/images/reading-side.svg";
import imageScreenshot from "@/assets/images/screenshot.png";
import OpenDoodlesSittingReading from "@/assets/images/sitting-reading.svg";
import Footer from "@/components/Footer";
import { site } from "@/constants/site";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginButton from "./_components/LoginButton";

export const runtime = "edge";

export const metadata = generateMetadataTitle();

export default async function Home() {
  const session = await auth();

  // セッションがある場合はライブラリにリダイレクト
  if (session?.user) {
    redirect("/library/want_read");
  }

  return (
    <>
      <section className="flex h-svh flex-col justify-between bg-[length:90vw] bg-[top_-20vw_right] bg-background bg-gradation bg-no-repeat p-8 sm:bg-[length:70vw] md:px-24 md:py-14 lg:bg-contain lg:bg-right">
        <div className="mt-auto flex w-full flex-col text-center md:my-auto md:w-fit md:text-left">
          <div className="mx-auto md:mx-0">
            <Image width={256} src={imageLogo} alt={site.name} />
            <p className="text-base text-tako">ver.beta</p>
          </div>

          <h1 className="mt-12 text-center text-2xl tracking-tight md:text-left md:text-5xl md:tracking-wide">
            {site.description.short}
          </h1>
          <p className="mt-4 text-center md:text-left">
            {site.description.long}
          </p>

          <LoginButton className="mt-12" />
        </div>
      </section>

      <section className="mt-24 md:px-24">
        <div>
          <h2 className="font-bold text-5xl md:tracking-wide">
            よみたいもよんでるも
          </h2>
          <p className="mt-6">
            読書の状況を「よみたい」「よんでる」「よんだ」の3状態で記録できます。
          </p>
          <p className="mt-1">記録するにはボタンをクリックするだけです。</p>
        </div>
        <Image
          className="mt-12 rounded-2xl border border-line shadow-xl"
          src={imageScreenshot}
          alt="スクリーンショット"
        />
      </section>

      <section className="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#fdf3eb"
            fillOpacity="1"
            d="M0,224L80,229.3C160,235,320,245,480,224C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
        <div className="flex justify-between bg-card px-24 py-8">
          <OpenDoodlesSittingReading className="w-1/2" />
          <div className="my-auto break-keep text-right">
            <h2 className="font-bold text-5xl leading-tight md:tracking-wide">
              できることは
              <wbr />
              記録だけ
            </h2>
            <p className="mt-6">
              誰かとつながったり、感想を共有するような機能はありません。
            </p>
            <p className="mt-1">
              しずかにゆったりと、本と向き合ってみませんか？
            </p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#fdf3eb"
            fillOpacity="1"
            d="M0,224L80,229.3C160,235,320,245,480,224C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </section>

      <section className="my-24 flex justify-between md:px-24">
        <div className="my-auto break-keep">
          <h2 className="font-bold text-5xl leading-tight md:tracking-wide">
            “よんだこと”を
            <wbr />
            記録しよう
          </h2>
          <p className="mt-6">yondako は個人開発のサービスです。</p>
          <p className="mt-1">利用料金はかかりません。ずーっと無料です。</p>
          <LoginButton className="mt-12" />
        </div>
        <OpenDoodlesReadingSide className="w-1/2" />
      </section>

      <Footer className="px-24 pb-8" />
    </>
  );
}
