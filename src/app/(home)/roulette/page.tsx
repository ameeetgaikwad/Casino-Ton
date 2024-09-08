import { TransactionHistory } from "@/components/transaction-history";
import { getAllTransaction } from "@/lib/db/action";
import { Header } from "./_component/header";
import { Roulette } from "./_component/roulette";
import { RouletteProvider } from "./_component/store";
import { ConnectButton } from "@/components/connect-button";

export const revalidate = 0;

export default async function Home() {
  const transactionHistory = await getAllTransaction("ROULETTE");

  return (
    <main className=" md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <RouletteProvider>
        <div className="hidden md:block">
          <Header
            lastTenOutcome={transactionHistory.map((o) => ({
              outcome: o.outcome,
            }))}
          />
        </div>
        <div className="flex gap-16 md:hidden">
          <ConnectButton />
        </div>

        <h1 className="text-6xl font-heading text-primary mt-4 mb-4">
          ROULETTE
        </h1>
        <Roulette />
      </RouletteProvider>
      <TransactionHistory records={transactionHistory} />
    </main>
  );
}
