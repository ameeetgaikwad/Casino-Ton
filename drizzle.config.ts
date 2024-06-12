import type { Config } from "drizzle-kit";


export default {
  schema: "./src/lib/db/schema",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  },
  tablesFilter: ["tbl_*"],
} satisfies Config;