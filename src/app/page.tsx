import imageLogo from "@/assets/images/logo/portrait.svg?url";
import OpenDoodlesReadingSide from "@/assets/images/open-doodles/reading-side.svg";
import OpenDoodlesSittingReading from "@/assets/images/open-doodles/sitting-reading.svg";
import BudouX from "@/components/BudouX";
import Footer from "@/components/Footer";
import { site } from "@/constants/site";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginButtons from "./_components/LoginButton";
import SlideIn from "./_components/SlideIn";

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
      <section className="flex h-svh flex-col justify-between bg-[length:90vw] bg-[top_-20vw_right] bg-gradation bg-primary-background bg-no-repeat px-8 py-8 sm:bg-[length:70vw] md:h-auto md:px-24 md:py-36 lg:bg-contain lg:bg-right">
        <div className="mt-auto flex w-full flex-col text-left md:my-auto md:w-fit">
          <div className="mx-auto md:mx-0">
            <Image width={256} src={imageLogo} alt={site.name} priority />
            <p className="text-2xl text-accent">ver.beta</p>
          </div>

          <h1 className="mt-12 text-center text-4xl leading-tight tracking-wide md:text-left md:text-5xl">
            <BudouX>{site.description.short}</BudouX>
          </h1>
          <p className="mt-4 text-center md:text-left">
            <BudouX>{site.description.long}</BudouX>
          </p>

          <LoginButtons className="mt-12 text-center md:max-w-64 md:text-left" />
        </div>
      </section>

      <section className="mt-24 px-8 md:mt-0 md:px-24">
        <div>
          <h2 className="space-y-1 font-bold text-4xl md:text-5xl md:tracking-wide">
            <BudouX>よみたいも、よんでるも</BudouX>
          </h2>
          <p className="mt-6">
            <BudouX>
              読書の状況を「よみたい」「よんでる」「よんだ」の3状態で記録できます。
            </BudouX>
          </p>
          <p className="mt-1">記録は簡単。ボタンをクリックするだけ。</p>
        </div>
        <SlideIn className="mt-12">
          <video
            className="w-full rounded-2xl border border-secondary-border"
            autoPlay
            muted
            loop
          >
            <source src="/videos/demo.webm" type="video/webm" />
          </video>
        </SlideIn>
      </section>

      <section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#fdf3eb"
            fillOpacity="1"
            d="M0,224L80,229.3C160,235,320,245,480,224C640,203,800,149,960,138.7C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
        <div className="bg-tertiary-background px-8 py-8 md:flex md:justify-between md:px-24">
          <SlideIn className="md:w-1/2">
            <OpenDoodlesSittingReading />
          </SlideIn>
          <div className="my-auto mt-12 text-right md:mt-auto">
            <h2 className="space-y-1 font-bold text-4xl md:text-5xl md:tracking-wide">
              <BudouX>できることは記録だけ</BudouX>
            </h2>
            <p className="mt-6 break-keep">
              誰かとつながったりするような機能はありません。
            </p>
            <p className="mt-1 break-keep">
              しずかにゆったりと
              <wbr />
              本と向き合ってみませんか？
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

      <section className="my-24 flex flex-col-reverse px-8 md:flex-row md:justify-between md:px-24">
        <div className="my-auto mt-12 md:mt-0">
          <h2 className="space-y-1 font-bold text-4xl tracking-wide md:text-5xl">
            <BudouX>“よんだこと”を記録しよう</BudouX>
          </h2>
          <p className="mt-6">
            <BudouX>yondako は個人開発のサービスです。</BudouX>
          </p>
          <p className="mt-1 break-keep">
            利用料金はかかりません。
            <wbr />
            ずーっと無料です。
          </p>
          <LoginButtons className="mt-12 text-center md:max-w-64 md:text-left" />
        </div>
        <SlideIn className="md:w-1/2">
          <OpenDoodlesReadingSide />
        </SlideIn>
      </section>

      <Footer className="px-8 pb-8 text-center md:px-24 md:text-left" />
    </>
  );
}
