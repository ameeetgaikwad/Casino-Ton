"use client";

import { cn } from "@/lib/utils";
import { getUserBalance } from "@/services/helpers/authHelper";
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export const CustomConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [userBalance, setUserBalance] = useState<number>(0);
  const address = useTonAddress();
  useEffect(() => {
    if (address) {
      const fetchUserBalance = async () => {
        const balance = await getUserBalance();
        setUserBalance(balance.balance);
      };
      const timeoutId = setTimeout(() => {
        fetchUserBalance();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [address]);

  return (
    <div className="flex gap-4">
      <p
        className={cn(
          "flex items-center bg-neutral-900 rounded-full",
          tonConnectUI?.connected ? "p-2" : ""
        )}
      >
        {tonConnectUI?.connected
          ? `${
              userBalance / 10 ** Number(process.env.NEXT_PUBLIC_USDC_DECIMALS)
            } USDC`
          : ""}
      </p>
      <TonConnectButton />
    </div>
  );
};
