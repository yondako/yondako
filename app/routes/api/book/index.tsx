import { createBook, getBook } from "@/db/queries/book";
import { upsertReadingStatus } from "@/db/queries/status";
import { searchBookFromNDL } from "@/libs/ndl/api";
import { bookStatusValues } from "@/types/book";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { object, picklist } from "valibot";

const schema = object({
  status: picklist(bookStatusValues),
});

const app = new Hono();

const routes = app.post(
  "/:id/status",
  vValidator("json", schema),
  async (c) => {
    const { user } = c.get("authUser");

    if (!user) {
      return c.json({ error: "ログインが必要です" }, 401);
    }

    const ndlBibId = c.req.param("id");
    const { status } = c.req.valid("json");

    // Dbに登録されているか確認
    let book = await getBook(c.env.DB, ndlBibId);
    console.log("[DB]", book);

    // DBに登録
    if (!book) {
      // NDLから書籍情報を取得
      const results = await searchBookFromNDL({ any: ndlBibId, cnt: 1 });

      if (!results || results.length <= 0) {
        return c.json({ error: "書籍がみつかりませんでした" }, 404);
      }

      book = results[0];

      await createBook(c.env.DB, book);

      console.log("[INSERT]", book);
    }

    // ステータスの変更をDBに反映
    const resultReadingStatus = await upsertReadingStatus(
      c.env.DB,
      user.id,
      book.ndlBibId,
      status,
    );

    return c.json(
      {
        info: book,
        status: resultReadingStatus,
        liked: false,
      },
      200,
    );
  },
);

export default app;

export type BookStatusType = typeof routes;
