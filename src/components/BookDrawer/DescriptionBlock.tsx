type Props = {
  label: string;
  values: string[];
};

export function DescriptionBlock({ label, values }: Props) {
  return (
    <div className="my-auto w-fit space-y-1 text-center text-xs">
      <p className="text-secondary-foreground">{label}</p>
      <p className="space-x-1">
        {values.map((value, i) => {
          const separator = i !== values.length - 1;

          return (
            <>
              <span className="inline-block" key={value}>
                {value}
              </span>
              {separator && <span>{"/"}</span>}
            </>
          );
        })}
      </p>
    </div>
  );
}
