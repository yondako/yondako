import imageLogo from "@/assets/images/logo_portrait.svg?url";
import LandingLayout from "@/components/LandingLayout";
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
    <LandingLayout showTermsNotice>
      <div className="mx-auto md:mx-0">
        <Image width={256} src={imageLogo} alt={site.name} />
        <p className="text-base text-tako">ver.beta</p>
      </div>
      <h1 className="mt-12 text-center text-3xl tracking-wide md:text-left md:text-4xl">
        {site.description.short}
      </h1>
      <p className="mt-4 text-center md:text-left">{site.description.long}</p>
      <LoginButton />
    </LandingLayout>
  );
}
