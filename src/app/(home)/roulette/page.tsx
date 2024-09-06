import { TransactionHistory } from "@/components/transaction-history";
import { getAllTransaction } from "@/lib/db/action";
import { Header } from "./_component/header";
import { Roulette } from "./_component/roulette";
import { RouletteProvider } from "./_component/store";

export const revalidate = 0;

export default async function Home() {
  const transactionHistory = await getAllTransaction("ROULETTE");

  return (
    <main className=" md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <RouletteProvider>
        <Header
          lastTenOutcome={transactionHistory.map((o) => ({
            outcome: o.outcome,
          }))}
        />
        <h1 className="text-6xl font-heading text-primary mt-4 mb-4">
          ROULETTE
        </h1>
        <Roulette />
      </RouletteProvider>
      <TransactionHistory records={transactionHistory} />
    </main>
  );
}
