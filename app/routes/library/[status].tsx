import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { readingStatusMetadata } from "@/constants/status";
import { getBooksByReadingStatus } from "@/db/queries/status";
import { readingStatusSchemaWithoutNone } from "@/schemas/readingStatus";
import { vValidator } from "@hono/valibot-validator";
import { createRoute } from "honox/factory";

export default createRoute(
  vValidator("param", readingStatusSchemaWithoutNone),
  async (c) => {
    const { user } = c.get("authUser");

    // TODO: 401
    if (!user?.email) {
      return c.notFound();
    }

    const { status } = c.req.valid("param");
    const books = await getBooksByReadingStatus(c.env.DB, user?.id, status);

    return c.render(
      <LibraryLayout current={status}>
        <BookList className="mt-10" items={books} hideReadingStatusBadge />
      </LibraryLayout>,
      {
        title: readingStatusMetadata.get(status)?.label,
      },
    );
  },
);
