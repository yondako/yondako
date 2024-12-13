import IconChevronRight from "@/assets/icons/chevron-right.svg";

type Props = {
  href: string;
  title: string;
  description: string;
};

export default function FormLink({ href, title, description }: Props) {
  return (
    <a
      className="flex w-full items-center rounded-2xl bg-tertiary-background p-8 text-primary-foreground transition hover:brightness-95"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="mr-auto">
        <h3 className="font-bold">{title}</h3>
        <p className="text-secondary-foreground text-sm">{description}</p>
      </div>
      <IconChevronRight className="ml-2 h-6 w-6" />
    </a>
  );
}
