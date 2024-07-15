import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { publishers } from "../schema/book";

/**
 * 出版社を登録
 * @param d1 D1Database
 * @param name 出版社名
 * @returns 出版社ID
 */
export async function createPublisher(
  d1: D1Database,
  name: string,
): Promise<number> {
  const db = drizzle(d1);

  const publisher = await db
    .select()
    .from(publishers)
    .where(eq(publishers.name, name))
    .get();

  // 既に存在する場合はそのIDを返す
  if (publisher?.id) {
    return publisher.id;
  }

  // 存在しない場合は登録
  const { id } = await db
    .insert(publishers)
    .values({ name })
    .onConflictDoNothing({
      target: publishers.name,
    })
    .returning()
    .get();

  return id;
}
