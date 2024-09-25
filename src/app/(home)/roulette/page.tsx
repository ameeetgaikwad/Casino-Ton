"use client";
import { TransactionHistory } from "./_component/transaction-history";
// import { getAllTransaction } from "@/db/action";
import { Header } from "./_component/header";
import { Roulette } from "./_component/roulette";
import { RouletteProvider } from "./_component/store";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { requestLastPlayedGames } from "@/services/helpers/rouletteHelper";
import { CustomConnectButton } from "@/components/CustomConnectButton";
export const revalidate = 0;

export default async function Home() {
  // const transactionHistory = await getAllTransaction("ROULETTE");
  const [transactionRecords, setTransactionRecords] = useState([]);

  useEffect(() => {
    const getLastPlayedGames = async () => {
      const games = await requestLastPlayedGames(10);
      setTransactionRecords(games);
    };
    getLastPlayedGames();
  }, []);

  return (
    <main className=" md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <RouletteProvider>
        <div className="flex justify-between">
          <div className="hidden md:block">
            <Header lastTenOutcome={transactionRecords} />
          </div>
          <div className="flex gap-16 md:justify-end">
            <CustomConnectButton />
          </div>
        </div>

        <h1 className="text-6xl font-heading text-primary mt-4 mb-4">
          ROULETTE
        </h1>
        <Roulette />
      </RouletteProvider>
      <TransactionHistory records={transactionRecords} />
    </main>
  );
}
