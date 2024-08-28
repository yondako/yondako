import { Fragment } from "react";

type Props = {
  label: string;
  values: string[];
};

export function DescriptionBlock({ label, values }: Props) {
  return (
    <div className="my-auto w-fit space-y-1 text-center text-xs">
      <p className="break-keep text-secondary-foreground">{label}</p>
      <p className="space-x-1">
        {values.map((value, i) => {
          const separator = i !== values.length - 1;

          return (
            <Fragment key={value}>
              <span className="inline-block">{value}</span>
              {separator && <span>{"/"}</span>}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}
