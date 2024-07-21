import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import { redirect } from "next/navigation";
import Layout from "../_components/Layout";
import LogoutButton from "./_components/LogoutButton";

export const runtime = "edge";

export const metadata = generateMetadataTitle("設定");

export default async function Settings() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/settings"));
  }

  return (
    <Layout current="設定">
      <LogoutButton />
    </Layout>
  );
}
