import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { statusList } from "@/constants/status";
import { getBooksByReadingStatus } from "@/db/queries/status";
import { readingStatusSchema } from "@/schemas/readingStatus";
import { vValidator } from "@hono/valibot-validator";
import { createRoute } from "honox/factory";

export default createRoute(
  vValidator("param", readingStatusSchema),
  async (c) => {
    const { user } = c.get("authUser");

    // TODO: 401
    if (!user?.email) {
      return c.notFound();
    }

    const { status } = c.req.valid("param");
    const books = await getBooksByReadingStatus(c.env.DB, user?.id, status);

    const title = statusList.get(status)?.label;

    return c.render(
      <LibraryLayout current={title}>
        <BookList className="mt-10" items={books} />
      </LibraryLayout>,
      {
        title
      },
    );
  },
);
