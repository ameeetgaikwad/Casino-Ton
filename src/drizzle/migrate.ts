import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = postgres('postgresql://postgres.rbmvtiukwjpclklufbsb:ol4G557ubb2GqIJ6@aws-0-us-east-1.pooler.supabase.com:6543/postgres', { max: 1 })

async function main() {
    const db = drizzle(migrationClient);
    await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
    await migrationClient.end();
}

main()