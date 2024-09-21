// import type { Config } from "drizzle-kit";


// export default {
//   schema: "./src/db/schema",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!
//   },
//   out: "./src/db/migrations",
//   tablesFilter: ["tbl_*"],
// } satisfies Config;
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  // driver: "pg",
  dbCredentials: {
    url: 'postgresql://postgres.rbmvtiukwjpclklufbsb:ol4G557ubb2GqIJ6@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  },
  verbose: true,
  strict: true,
  // tablesFilter: ["tbl_*"],
});
