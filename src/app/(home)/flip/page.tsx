"use client";
import { getEthFiatRate } from "@/services/transactionHistoryService";
import { BetForm } from "./_component/bet-form";
import { Header } from "./_component/header";
import { TransactionHistory } from "./_component/transaction-history";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { requestGameEntries } from "@/services/helpers/flipHelper";
import { CustomConnectButton } from "@/components/CustomConnectButton";

export const revalidate = 0;

export default async function Home() {
  const [transactionRecords, setTransactionRecords] = useState([]);
  const [ethRate, setEthRate] = useState(0);
  const address = useTonAddress();

  useEffect(() => {
    const fetchEthRate = async () => {
      const rate = await getEthFiatRate();
      setEthRate(rate);
    };
    fetchEthRate();
  }, []);

  useEffect(() => {
    if (address) {
      const getEntries = async () => {
        const entries = await requestGameEntries(10);
        setTransactionRecords(entries);
      };
      getEntries();
    }
  }, []);

  return (
    <>
      <main className="md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
        <div className="flex justify-between">
          <div className="hidden md:block">
            <Header lastTenOutcome={transactionRecords} />
          </div>
          <div className="flex gap-16 md:justify-end">
            <CustomConnectButton />
          </div>
        </div>

        <h1 className="text-6xl font-heading text-primary mt-4 mb-4">
          COINFLIP
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full ">
          <BetForm fiatRate={Number(ethRate["USD"] ?? 200)} />
        </div>
        <TransactionHistory records={transactionRecords} />
      </main>
    </>
  );
}
