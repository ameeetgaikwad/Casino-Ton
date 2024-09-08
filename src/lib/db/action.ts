'use server';

import { InferInsertModel, and, db, desc, eq, schema, sum } from "@/lib/db";
import { revalidatePath } from "next/cache";
export type GameType = typeof schema.GAME_TYPE.enumValues[number]


export const saveTransactionData = async (values: InferInsertModel<typeof schema.transactionHistory>, path: string = '/coin') => {
  await db.insert(schema.transactionHistory).values(values).returning()
  revalidatePath(path, 'page')
}

export const getAllTransaction = async (gameType: GameType) => {
  return db.select()
    .from(schema.transactionHistory)
    .where(eq(schema.transactionHistory.gameType, gameType))
    .limit(10)
    .orderBy(desc(schema.transactionHistory.createdAt))
}



export const totalBetAmount = async (address: string, gameType: GameType) => {
  return db.select({ value: sum(schema.transactionHistory.wager) })
    .from(schema.transactionHistory)
    .where(and(eq(schema.transactionHistory.player, address), eq(schema.transactionHistory.gameType, gameType)));
}


export async function getEthFiatRate() {
  const url = "https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=USD,EUR";
  return fetch(url).then(res => res.json())
}