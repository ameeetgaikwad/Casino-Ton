import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 })

async function main() {
    const db = drizzle(migrationClient);
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    await migrationClient.end();
}

main()