import IconLogout from "#src/assets/icons/logout.svg";
import Button from "#src/components/Button/index";
import { signOut } from "#src/lib/auth";

export default function LogoutButton() {
  const handleSubmit = async () => {
    "use server";

    await signOut({ redirectTo: "/" });
  };

  return (
    <form action={handleSubmit}>
      <Button
        className="flex w-full items-center justify-center space-x-2 text-sm sm:w-48"
        type="submit"
      >
        <IconLogout className="h-5 w-5" />
        <span>ログアウト</span>
      </Button>
    </form>
  );
}
