import { getAllTransaction, getEthFiatRate } from "@/lib/db/action";
import { BetForm } from "./_component/bet-form";
import { Header } from "./_component/header";
import { TransactionHistory } from "@/components/transaction-history";
// import { listenForEvents } from "@/lib/coin-flip-oracle";
// import { useEffect } from "react";

export const revalidate = 0;

export default async function Home() {
  const transactionHistory = await getAllTransaction("COIN");
  const ethRate = await getEthFiatRate();

  //   useEffect(() => {
  // listenForEvents();
  //   }, []);

  return (
    <main className="-ml-48 md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <Header
        lastTenOutcome={transactionHistory.map((o) => ({
          outcome: o.outcome,
        }))}
      />
      <h1 className="text-6xl font-heading text-primary mt-4 mb-4">COINFLIP</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full ">
        <BetForm fiatRate={Number(ethRate["USD"] ?? 200)} />
      </div>
      {transactionHistory.length > 0 && <TransactionHistory records={transactionHistory} />}
    </main>
  );
}
