import { searchBookFromNDL } from "@/libs/ndl/api";
import { createRoute } from "honox/factory";

export const POST = createRoute(async (c) => {
  const ndlBibId = c.req.param("id");
  const { status } = await c.req.parseBody<{ status: string }>();

  console.log(ndlBibId, status);

  // TODO:
  // まずはDBに存在するか確認
  // 無い場合は検索

  // NDLから書籍情報を取得
  const results = await searchBookFromNDL({ any: ndlBibId, cnt: 1 });

  // FIXME: エラーレスポンスを決めてそれを返す
  if (results.length <= 0) {
    c.status(404);

    return c.json({
      ok: false,
      message: "Book not found",
    });
  }

  c.status(200);

  // TODO: DBに反映後のデータを返す
  return c.json({
    info: results[0],
    status,
    liked: false,
  });
});
