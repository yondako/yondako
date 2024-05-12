import { searchBookFromNDL } from "@/libs/ndl/api";
import { vValidator } from "@hono/valibot-validator";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
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

    // Dbに登録されているか確認
    const adapter = new PrismaD1(c.env.DB);
    const prismaClient = new PrismaClient({ adapter });

    let book = await prismaClient.book.findUnique({
      where: {
        ndlBibId,
      },
    });

    // DBに登録
    if (!book) {
      // NDLから書籍情報を取得
      const results = await searchBookFromNDL({ any: ndlBibId, cnt: 1 });

      if (!results || results.length <= 0) {
        return c.json(
          {
            message: "書籍がみつかりませんでした",
          },
          404,
        );
      }

      book = await prismaClient.book.create({
        data: results[0],
      });
    }

    // TODO: ステータスの変更をDBに反映

    // TODO: 反映後のデータを返す
    return c.json(
      {
        info: book,
        status,
        liked: false,
      },
      200,
    );
  },
);

export default app;

export type BookStatusType = typeof routes;
