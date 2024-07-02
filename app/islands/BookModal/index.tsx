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
import { FunctionComponent, ReactNode, SVGProps } from "react";

const client = hc<BookStatusType>("/api/book");

type Props = {
  data: BookType;
  children: ReactNode;
};

export default function BookModal({ data, children }: Props) {
  // const [book, setBook] = useState(data);
  // const [optimisticStatus, addOptimisticStatus] = useOptimistic(
  //   book.readingStatus,
  // );

  // 読書ステータスが変更された
  // const changeStatusFormAction = async (formData: FormData) => {
  //   const newStatus = formData.get("status") as BookType["readingStatus"];
  //
  //   addOptimisticStatus(newStatus);
  //
  //   const res = await client[":id"].status.$post({
  //     param: {
  //       id: book.info.ndlBibId,
  //     },
  //     json: {
  //       status: newStatus,
  //     },
  //   });
  //
  //   if (res.ok) {
  //     const json = await res.json();
  //     setBook(json);
  //   }
  //
  //   // TODO: トーストとかでエラーを表示する
  //   if (res.status === 404) {
  //     const json = await res.json();
  //     console.error(json.error);
  //   }
  // };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="w-full">{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm backdrop-brightness-90" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between w-full max-w-lg p-6 bg-card rounded-2xl backdrop-blur-2xl">
          <div className="pl-[10.5rem]">
            <BookThumbnail
              className="absolute -top-8 left-6 w-36"
              src={data.info.thumbnailUrl}
            />

            <Dialog.Title className="font-bold text-base leading-5 line-clamp-3">
              {data.info.title}
            </Dialog.Title>

            <div className="mt-4 space-y-1">
              <Tags Icon={IconFeather} items={data.info.authors} />
              <Tags Icon={IconBuilding} items={data.info.publishers} />
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <button className="px-3 py-1 flex items-center text-sm text-tako space-x-1 border border-tako rounded-full">
                <IconBrandAmazon className="w-4 h-4" />
                <span>Amazon</span>
              </button>
              <button className="px-3 py-1 flex items-center text-sm text-tako space-x-1 border border-tako rounded-full">
                <IconShoppingCart className="w-4 h-4" />
                <span>honto</span>
              </button>
            </div>
          </div>

          <div className="mt-8 w-full px-4 flex justify-between text-tako">
            {readingStatusValues.map((status) => {
              const item = statusList.get(status);

              return item ? (
                <button>
                  <item.IconSolid className="mx-auto mb-1 w-6 h-6" />
                  <span className="text-xxs">{item.label}</span>
                </button>
              ) : null;
            })}
          </div>
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
    <p className="flex items-center space-x-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{items.join(", ")}</span>
    </p>
  ) : null;
}

// <form
//   className="m-0 lg:pb-1 col-span-2 lg:col-span-1 flex items-end space-x-2 text-xs whitespace-nowrap"
//   action={changeStatusFormAction}
// >
//   {statusList.map((item) => (
//     <StatusButton
//       {...item}
//       key={item.value}
//       type="submit"
//       name="status"
//       selected={optimisticStatus === item.value}
//     />
//   ))}
// </form>
