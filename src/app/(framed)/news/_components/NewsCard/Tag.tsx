type Props = {
  name: string;
};

export default function Tag({ name }: Props) {
  return (
    <span className="block rounded-full bg-accent px-3 py-0.5 text-tertiary-background text-xs">
      {name}
    </span>
  );
}
