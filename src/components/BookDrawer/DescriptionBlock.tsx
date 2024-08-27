type Props = {
  label: string;
  value: string;
};

export function DescriptionBlock({ label, value }: Props) {
  return (
    <div className="w-fit space-y-1 text-center text-xs">
      <p className="text-secondary-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}
