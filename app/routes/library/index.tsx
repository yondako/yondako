import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { getBooksByReadingStatus } from "@/db/queries/status";
import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
  const { user } = c.get("authUser");

  // TODO: 401
  if (!user?.email) {
    return c.notFound();
  }

  await getBooksByReadingStatus(c.env.DB, user?.id, "read");

  return c.render(
    <LibraryLayout current="よんでる">
      <BookList className="mt-10" items={[]} />
    </LibraryLayout>,
    {
      title: "よんでる",
    },
  );
});
