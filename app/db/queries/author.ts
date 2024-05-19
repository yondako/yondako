import { drizzle } from "drizzle-orm/d1";
import { authors } from "../schema/book";
import { eq } from "drizzle-orm";

/**
 * 著者を登録
 * @param d1 D1Database
 * @param name 著者名
 * @returns 著者ID
 */
export async function createAuthor(
  d1: D1Database,
  name: string,
): Promise<number> {
  const db = drizzle(d1);

  const author = await db
    .select()
    .from(authors)
    .where(eq(authors.name, name))
    .get();

  // 既に存在する場合はそのIDを返す
  if (author?.id) {
    return author.id;
  }

  // 存在しない場合は登録
  const { id } = await db
    .insert(authors)
    .values({ name })
    .onConflictDoNothing({
      target: authors.name,
    })
    .returning()
    .get();

  return id;
}
