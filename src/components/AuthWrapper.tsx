"use client";
import { useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { toUserFriendlyAddress } from "@tonconnect/sdk";
import { getJwt } from "@/services/authService";
import { Cookies } from "react-cookie";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [tonConnectUI] = useTonConnectUI();
  const cookies = new Cookies();
  const address = useTonAddress();

  useEffect(
    () =>
      tonConnectUI.onStatusChange((wallet) => {
        if (!wallet) {
          console.log("wallet not found");
          cookies.remove("token");
        } else {
          console.log("wallet found");
          signIn(wallet.account.address);
        }
      }),
    []
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!tonConnectUI.connected) {
        cookies.remove("token");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [address]);

  async function signIn(rawAddress: string) {
    const userFriendlyAddress = toUserFriendlyAddress(
      rawAddress,
      process.env.NEXT_PUBLIC_IS_TESTNET === "true"
    );

    await getJwt(userFriendlyAddress);
  }

  return <>{children}</>;
}
