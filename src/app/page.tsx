import imageLogo from "@/assets/images/logo_portrait.svg?url";
import LandingLayout from "@/components/LandingLayout";
import { site } from "@/constants/site";
import { generateMetadataTitle } from "@/lib/metadata";
import Image from "next/image";
import LoginButton from "./_components/LoginButton";

export const runtime = "edge";

export const metadata = generateMetadataTitle();

export default function Home() {
  return (
    <LandingLayout>
      <Image
        className="mx-auto md:mx-0"
        width={256}
        src={imageLogo}
        alt={site.name}
      />
      <h1 className="mt-12 text-center text-3xl tracking-wide md:text-left md:text-4xl">
        {site.description.short}
      </h1>
      <p className="mt-6 text-center md:text-left">{site.description.long}</p>
      <LoginButton />
    </LandingLayout>
  );
}
