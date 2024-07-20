import Button from "@/components/Button";
import { signOut } from "@/lib/auth";

export default function LogoutButton() {
  const handleSubmit = async () => {
    "use server";

    await signOut({ redirectTo: "/" });
  };

  return (
    <form action={handleSubmit}>
      <Button type="submit">ログアウト</Button>
    </form>
  );
}
