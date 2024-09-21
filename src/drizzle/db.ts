import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from 'postgres'

const client = postgres('postgresql://postgres.rbmvtiukwjpclklufbsb:ol4G557ubb2GqIJ6@aws-0-us-east-1.pooler.supabase.com:6543/postgres')
export const db = drizzle(client, { schema, logger: true })