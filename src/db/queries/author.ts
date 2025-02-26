import { eq } from "drizzle-orm";
import { getDB } from "..";
import { authors } from "../schema/book";

/**
 * 著者を登録
 * @param dbInstance D1のインスタンス
 * @param name 著者名
 * @returns 著者ID
 */
export async function createAuthor(
  dbInstance: D1Database,
  name: string,
): Promise<number> {
  const database = getDB(dbInstance);

  const author = await database
    .select()
    .from(authors)
    .where(eq(authors.name, name))
    .get();

  // 既に存在する場合はそのIDを返す
  if (author?.id) {
    return author.id;
  }

  // 存在しない場合は登録
  const { id } = await database
    .insert(authors)
    .values({ name })
    .onConflictDoNothing({
      target: authors.name,
    })
    .returning()
    .get();

  return id;
}
