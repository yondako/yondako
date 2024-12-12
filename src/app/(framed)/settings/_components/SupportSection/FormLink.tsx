type Props = {
  href: string;
  title: string;
  description: string;
};

export default function FormLink({ href, title, description }: Props) {
  return (
    <a
      className="block w-full rounded-2xl bg-tertiary-background p-8 text-primary-foreground transition hover:brightness-95"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <h3 className="font-bold">{title}</h3>
      <p className="text-secondary-foreground text-sm">{description}</p>
    </a>
  );
}
