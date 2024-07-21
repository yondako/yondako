type Props = {
  title: string;
};

export function Loading({ title }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <p className="animate-bounce cursor-grab font-noto-emoji">₍₍⁽⁽🐙₎₎⁾⁾</p>
      <p className="text-xs">{title}</p>
    </div>
  );
}
