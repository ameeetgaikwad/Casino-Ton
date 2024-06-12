import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as transactionHistory from "./schema/transaction-history";

export const schema = { ...transactionHistory };

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";


export const sql = postgres(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });