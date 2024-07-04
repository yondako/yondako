import IconBrandAmazon from "@/assets/icons/brand-amazon.svg?react";
import IconBuilding from "@/assets/icons/building.svg?react";
import IconFeather from "@/assets/icons/feather.svg?react";
import IconShoppingCart from "@/assets/icons/shopping-cart.svg?react";
import { BookThumbnail } from "@/components/common/BookThumbnail";
import { statusList } from "@/constants/status";
import { BookStatusType } from "@/routes/api/book";
import { BookType, readingStatusValues } from "@/types/book";
import * as Dialog from "@radix-ui/react-dialog";
import { hc } from "hono/client";
import {
  FunctionComponent,
  ReactNode,
  SVGProps,
  useOptimistic,
  useState,
} from "react";

const client = hc<BookStatusType>("/api/book");

type Props = {
  data: BookType;
  children: ReactNode;
};

export default function BookModal({ data, children }: Props) {
  const [book, setBook] = useState(data);
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    book.readingStatus ?? "none",
  );

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    addOptimisticStatus(newStatus);

    const res = await client[":id"].status.$post({
      param: {
        id: book.info.ndlBibId,
      },
      json: {
        status: newStatus,
      },
    });

    if (res.ok) {
      const json = await res.json();
      setBook(json);
    }

    // TODO: トーストとかでエラーを表示する
    if (res.status === 404) {
      const json = await res.json();
      console.error(json.error);
    }
  };

  return (
    <Dialog.Root modal>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm backdrop-brightness-90" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between w-full max-w-xl px-6 pt-6 pb-4 bg-card rounded-2xl backdrop-blur-2xl">
          <div className="min-h-36 pl-[10.5rem]">
            <BookThumbnail
              className="absolute -top-8 left-6 w-36"
              src={book.info.thumbnailUrl}
            />

            <Dialog.Title className="font-bold text-lg leading-5 line-clamp-3">
              {book.info.title}
            </Dialog.Title>

            <div className="mt-4 space-y-2">
              <Tags Icon={IconFeather} items={book.info.authors} />
              <Tags Icon={IconBuilding} items={book.info.publishers} />
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <button className="flex items-center text-sm text-tako space-x-2 rounded-full">
                <IconBrandAmazon className="w-4 h-4" />
                <span>Amazon</span>
              </button>
              <button className="flex items-center text-sm text-tako space-x-2 rounded-full">
                <IconShoppingCart className="w-4 h-4" />
                <span>honto</span>
              </button>
            </div>
          </div>

          <form
            className="m-0 px-4 pt-6 w-full flex justify-between text-tako"
            action={changeStatusFormAction}
          >
            {readingStatusValues.map((status) => {
              const item = statusList.get(status);

              if (!item) {
                return null;
              }

              const selected = status === optimisticStatus;
              const Icon = selected ? item.IconFilled : item.IconSolid;

              return item ? (
                <button
                  className="w-20 h-14 bg-card rounded-2xl transition hover:brightness-95"
                  key={item.label}
                  type="submit"
                  name="status"
                  value={status}
                  disabled={selected}
                >
                  <Icon className="mx-auto mb-1 w-6 h-6" />
                  <span className="text-xxs">{item.label}</span>
                </button>
              ) : null;
            })}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type TagProps = {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  items: string[] | undefined;
};

function Tags({ Icon, items }: TagProps) {
  return items && items.length > 0 ? (
    <Dialog.Description className="flex items-center space-x-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs line-clamp-1">{items.join(", ")}</span>
    </Dialog.Description>
  ) : null;
}
