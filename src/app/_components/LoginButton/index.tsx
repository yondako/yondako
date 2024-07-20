import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg";
import { signIn } from "@/lib/auth";

export default function LoginButton() {
  const handleSubmit = async () => {
    "use server";

    await signIn("github", { redirectTo: "/library/reading" });
  };

  return (
    <form className="mt-12 flex flex-col space-y-4" action={handleSubmit}>
      <button
        className="mx-auto block h-[41px] w-[189px] md:mx-0"
        type="submit"
      >
        <IconContinueWithGithub />
      </button>
    </form>
  );
}
