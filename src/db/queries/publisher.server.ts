import { eq } from "drizzle-orm";
import { publishers } from "../schema/book";
import db from "..";

/**
 * 出版社を登録
 * @param name 出版社名
 * @returns 出版社ID
 */
export async function createPublisher(name: string): Promise<number> {
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
