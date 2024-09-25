"use client";

import { getUserBalance } from "@/services/helpers/authHelper";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [houseBalance, setHouseBalance] = useState(0);
  useEffect(() => {
    const fetchHouseBalance = async () => {
      const balance = await getUserBalance();
      setHouseBalance(balance);
    };

    fetchHouseBalance();
  }, []);
  return (
    <>
      <div className="flex gap-4">
        {tonConnectUI?.connected && (
          <p className="flex items-center bg-neutral-900 p-2 rounded-full">
            {houseBalance} USDC
          </p>
        )}
        <TonConnectButton />
      </div>
    </>
  );
};
