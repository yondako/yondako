import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { redirect } from "next/navigation";
import AccountSection from "./_components/AccountSection";
import SupportSection from "./_components/SupportSection";

export const runtime = "edge";

export const metadata = generateMetadataTitle("設定");

export default async function Settings() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/settings"));
  }

  return (
    <>
      <AccountSection userId={session.user.id} />
      <SupportSection userId={session.user.id} />
      <Footer className="mt-8 text-center lg:hidden" />
    </>
  );
}
