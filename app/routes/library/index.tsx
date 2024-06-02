import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LibraryLayout current="よむ">
      <BookList className="mt-10" items={[]} />
    </LibraryLayout>,
    {
      title: "よむ",
    },
  );
});
