import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      richColors
      toastOptions={{
        className: "rounded-2xl text-base",
        descriptionClassName: "text-xs",
        style: {
          fontFamily: "var(--font-line-seed-jp)",
        },
      }}
    />
  );
}
