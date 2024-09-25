"use client";

import { getUserBalance } from "@/services/helpers/authHelper";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    const fetchUserBalance = async () => {
      const balance = await getUserBalance();
      setUserBalance(balance.balance);
    };
    fetchUserBalance();
  }, [tonConnectUI?.connected]);

  return (
    <div className="flex gap-4">
      <p className="flex items-center bg-neutral-900 rounded-full p-2">
        {tonConnectUI?.connected ? `${userBalance} USDC` : ""}
      </p>
      <TonConnectButton />
    </div>
  );
};
