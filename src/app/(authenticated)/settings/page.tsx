import Layout from "../_components/Layout";
import LogoutButton from "./_components/LogoutButton";

export const runtime = "edge";

export default function Settings() {
  return (
    <Layout current="設定">
      <LogoutButton />
    </Layout>
  );
}