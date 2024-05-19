import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { site } from "@/constants/site";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LibraryLayout current="よむ本">
      <BookList className="mt-10" items={[]} />
    </LibraryLayout>,
    {
      title: `よむ本 | ${site.name}`,
    },
  );
});
