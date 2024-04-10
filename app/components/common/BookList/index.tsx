import { classNames } from "@/libs/classNames";
import Book, { type BookProps } from "../Book";

type Props = {
  items: BookProps[];
} & JSX.IntrinsicElements["div"];

export default function BookList({ items, ...props }: Props) {
  return (
    <div className={classNames("space-y-6", props.className)}>
      {items.map((props, i) => {
        return (
          <>
            {i !== 0 && (
              <div
                className="my-2 w-full h-0 border-t border-line"
                key={`hr-${i.toString()}`}
              />
            )}
            <Book {...props} key={props.book.id} />
          </>
        );
      })}
    </div>
  );
}
