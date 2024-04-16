import logoUrl from "@/assets/images/logo_portrait.svg";
import LandingLayout from "@/components/landing/Layout";
import { site } from "@/constants/site";
import PasskeyOpenButton from "@/islands/passkey";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LandingLayout>
      <div className="max-w-[26rem]">
        <img className="m-auto" width={256} src={logoUrl} alt={site.name} />
        <h1 className="mt-10 text-3xl lg:text-4xl tracking-wide text-center">
          {site.description.short}
        </h1>
        <p className="mt-6">{site.description.long}</p>
        <PasskeyOpenButton />
      </div>
    </LandingLayout>,
    {
      title: `${site.name} | ${site.description.short}`,
    },
  );
});
