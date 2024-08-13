import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as transactionHistory from "./schema/transaction-history";
import * as lotteries from "./schema/lotteries";
import * as tickets from "./schema/tickets";

export const schema = { ...transactionHistory, lotteries, tickets };

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const sql = postgres(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle(sql, { schema });

