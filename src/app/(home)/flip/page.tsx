"use client";
import { getEthFiatRate } from "@/services/transactionHistoryService";
// import { getAllTransaction, getEthFiatRate } from "@/db/action";
import { BetForm } from "./_component/bet-form";
import { Header } from "./_component/header";
import { TransactionHistory } from "@/components/transaction-history";
// import { ConnectButton } from "@/components/connect-button";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
export const revalidate = 0;

export default async function Home() {
  // const transactionHistory = await getAllTransaction("COIN");
  const [ethRate, setEthRate] = useState(0);
  console.log(ethRate, "fr eth rate");
  useEffect(() => {
    const fetchEthRate = async () => {
      const rate = await getEthFiatRate();
      setEthRate(rate);
    };
    fetchEthRate();
  }, []);

  return (
    <main className="md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="flex gap-16 md:hidden">
        <TonConnectButton />
      </div>
      <h1 className="text-6xl font-heading text-primary mt-4 mb-4">COINFLIP</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full ">
        <BetForm fiatRate={Number(ethRate["USD"] ?? 200)} />
      </div>
      {/* {transactionHistory.length > 0 && (
        <TransactionHistory records={transactionHistory} />
      )} */}
    </main>
  );
}
