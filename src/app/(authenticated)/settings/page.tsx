import { auth } from "@/lib/auth.server";
import Layout from "../_components/Layout";
import LogoutButton from "./_components/LogoutButton";

export const runtime = "edge";

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
