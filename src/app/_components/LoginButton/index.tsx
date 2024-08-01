import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg";
import IconContinueWithGoogle from "@/assets/icons/continue-with-google.svg";
import { signIn } from "@/lib/auth.server";

export default function LoginButton() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const provider = formData.get("provider") as string;

    await signIn(provider, { redirectTo: "/library/reading" });
  };

  return (
    <form className="mt-10 flex flex-col space-y-2" action={handleSubmit}>
      <button
        className="mx-auto block h-[41px] w-[189px] md:mx-0"
        type="submit"
        name="provider"
        value="google"
      >
        <IconContinueWithGoogle />
      </button>
      <button
        className="mx-auto block h-[41px] w-[189px] md:mx-0"
        type="submit"
        name="provider"
        value="github"
      >
        <IconContinueWithGithub />
      </button>
    </form>
  );
}
