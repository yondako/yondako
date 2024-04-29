import Book, { BookProps } from "@/islands/Book";

type Props = {
  items: BookProps[];
} & JSX.IntrinsicElements["div"];

export default function BookList({ items, ...props }: Props) {
  return (
    <div className={props.className}>
      {items.map((props, i) => {
        return (
          <>
            {i !== 0 && (
              <div
                className="my-6 w-full border-t border-line"
                key={`hr-${i.toString()}`}
              />
            )}
            <Book {...props} key={props.book.ndlBibId} />
          </>
        );
      })}
    </div>
  );
}
