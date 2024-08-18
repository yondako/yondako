import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg";
import IconContinueWithGoogle from "@/assets/icons/continue-with-google.svg";
import ExternalLink from "@/components/ExternalLink";
import { links } from "@/constants/site";
import { signIn } from "@/lib/auth";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

export default function LoginButton({ className }: Props) {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const provider = formData.get("provider") as string;

    await signIn(provider, { redirectTo: "/library/want_read" });
  };

  return (
    <>
      <form
        className={twMerge("flex flex-col space-y-2", className)}
        action={handleSubmit}
      >
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
      <div className="mt-4 text-xxs">
        <p>アカウントを登録することにより、</p>
        <p>
          <ExternalLink className="mr-1 font-bold" href={links[2].href}>
            {links[2].title}
          </ExternalLink>
          および
          <ExternalLink className="mx-1 font-bold" href={links[3].href}>
            {links[3].title}
          </ExternalLink>
          に同意したものとみなされます。
        </p>
      </div>
    </>
  );
}
