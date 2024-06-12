'use server';

import { InferInsertModel, db, desc, eq, schema, sum } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cache } from "react";



export const saveTransactionData = async (values: InferInsertModel<typeof schema.transactionHistory>) => {
  await db.insert(schema.transactionHistory).values(values).returning()
  revalidatePath('/')
}

export const getAllTransaction = cache(async () => {
  return db.select()
    .from(schema.transactionHistory)
    .limit(10)
    .orderBy(desc(schema.transactionHistory.createdAt))
})



export const totalBetAmount = async (address: string) => {
  return db.select({ value: sum(schema.transactionHistory.wager) }).from(schema.transactionHistory).where(eq(schema.transactionHistory.player, address));
}


export async function getEthFiatRate() {
  const url = "https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=USD,EUR";
  return fetch(url).then(res => res.json())
}