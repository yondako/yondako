import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function SettingProperty({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-secondary-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}
