import { drizzle } from "drizzle-orm/d1";

const db = drizzle((process.env as unknown as { DB: D1Database }).DB);

export default db;
