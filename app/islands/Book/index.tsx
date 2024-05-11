import imageNoImage from "@/assets/images/noimage.webp";
import LikeButton from "@/components/common/Book/LikeButton";
import StatusButton from "@/components/common/Book/StatusButton";
import Tag from "@/components/common/Book/Tag";
import { IconBookmark } from "@/components/common/Icon/Bookmark";
import { IconBuilding } from "@/components/common/Icon/Building";
import { IconCheck } from "@/components/common/Icon/Check";
import { IconMoodEmpty } from "@/components/common/Icon/MoodEmpty";
import { IconPencil } from "@/components/common/Icon/Pencil";
import { BookType } from "@/types/book";
import { IconType } from "@/types/icon";
import { useOptimistic, useState } from "react";

// TODO: APIのレスポンス型をそのまま使いたい
export type BookProps = {
  book: BookType;
  liked: boolean;
  status: "none" | "read" | "want_read";
};

type StatusType = {
  text: string;
  Icon: IconType;
  value: BookProps["status"];
};

const statusList: StatusType[] = [
  {
    text: "よんでない",
    Icon: IconMoodEmpty,
    value: "none",
  },
  {
    text: "よむ",
    Icon: IconBookmark,
    value: "read",
  },
  {
    text: "よんだ",
    Icon: IconCheck,
    value: "want_read",
  },
];

export default function Book(props: BookProps) {
  const imageBgStyle = "w-full h-full object-contain bg-background-sub";

  const [data, setData] = useState(props);
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(data.status);
  const [optimisticLiked, addOptimisticLiked] = useOptimistic(data.liked);

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookProps["status"];

    addOptimisticStatus(newStatus);

    console.log(formData);
    console.log(`/api/book/${data.book.ndlBibId}/status`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // APIリクエスト
    // const response = await fetch(`/api/book/${data.book.ndlBibId}/status`, {
    //  method: "POST",
    //  body: formData,
    //  headers: {
    //  "Content-Type": "application/json",
    //  },
    //  });
    //  const json = await response.json();

    // レスポンスを反映
    //  setData(json);
  };

  return (
    <div className="h-40 grid grid-cols-[5rem_1fr] lg:grid-cols-[8rem_1fr] grid-rows-2 lg:grid-rows-3 gap-3 lg:gap-4">
      <div className="row-span-2 lg:row-span-3 flex justify-center items-center bg-background border border-line rounded-md overflow-hidden">
        <object
          className={imageBgStyle}
          type="image/jpeg"
          data={data.book.thumbnailUrl}
        >
          {/* 書影が無かった場合のフォールバック */}
          <img className={imageBgStyle} src={imageNoImage} alt="" />
        </object>
      </div>

      <div className="pt-1 row-span-1 lg:row-span-1 flex justify-between items-center space-x-3">
        <h2 className="font-bold text-base lg:text-lg leading-5 lg:leading-6 line-clamp-2">
          {data.book.title}
        </h2>
        <LikeButton liked={optimisticLiked} />
      </div>

      <div className="row-span-1 lg:content-center space-y-1 text-text text-xs">
        {data.book.authors && (
          <Tag Icon={IconPencil} text={data.book.authors.join(", ")} />
        )}
        {data.book.publisher && (
          <Tag Icon={IconBuilding} text={data.book.publisher.join(", ")} />
        )}
      </div>

      <form
        className="m-0 lg:pb-1 col-span-2 lg:col-span-1 flex items-end space-x-2 text-xs whitespace-nowrap"
        action={changeStatusFormAction}
      >
        {statusList.map((item) => (
          <StatusButton
            {...item}
            key={item.value}
            type="submit"
            name="status"
            selected={optimisticStatus === item.value}
          />
        ))}
      </form>
    </div>
  );
}
