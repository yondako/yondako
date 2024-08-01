import Button from "@/components/Button";
import { signOut } from "@/lib/auth.server";
import IconLogout from "@/assets/icons/logout.svg";

export default function LogoutButton() {
  const handleSubmit = async () => {
    "use server";

    await signOut({ redirectTo: "/" });
  };

  return (
    <form className="mt-4" action={handleSubmit}>
      <Button
        className="flex w-full items-center justify-center space-x-2 md:max-w-48"
        type="submit"
      >
        <IconLogout className="h-5 w-5" />
        <span>ログアウト</span>
      </Button>
    </form>
  );
}
