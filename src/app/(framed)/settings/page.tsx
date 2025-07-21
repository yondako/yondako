import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import { PATH_SETTING } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import AccountSection from "./_components/AccountSection";
import SupportSection from "./_components/SupportSection";

export const dynamic = "force-dynamic";

export const metadata = generateMetadataTitle({
  pageTitle: "設定",
  noindex: true,
});

export default async function Settings() {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_SETTING));
  }

  return (
    <>
      <AccountSection userId={session.user.id} />
      <SupportSection userId={session.user.id} />
      <Footer className="mt-8 text-center lg:hidden" />
    </>
  );
}
