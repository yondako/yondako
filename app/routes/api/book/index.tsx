import { searchBookFromNDL } from "@/libs/ndl/api";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { object, picklist } from "valibot";

const schema = object({
  status: picklist(["none", "read", "want_read"]),
});

const app = new Hono();

const routes = app.post(
  "/:id/status",
  vValidator("json", schema),
  async (c) => {
    const ndlBibId = c.req.param("id");
    const { status } = c.req.valid("json");

    console.log(ndlBibId, status);

    // TODO:
    // まずはDBに存在するか確認
    // 無い場合は検索

    // NDLから書籍情報を取得
    // TODO: APIのエラーハンドリング
    const results = await searchBookFromNDL({ any: ndlBibId, cnt: 1 });

    if (results.length <= 0) {
      return c.json(
        {
          message: "書籍がみつかりませんでした",
        },
        404,
      );
    }

    // TODO: DBに反映後のデータを返す
    return c.json(
      {
        info: results[0],
        status,
        liked: false,
      },
      200,
    );
  },
);

export default app;

export type BookStatusType = typeof routes;
