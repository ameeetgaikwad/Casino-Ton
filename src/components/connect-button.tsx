"use client";
import { useEffect } from "react";
import { useContract } from "@/hooks/use-contract";
import { useGetContractBalance } from "@/hooks/use-get-contract-balance";
import { ConnectButton as _ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const ConnectButton = () => {
  useEffect(() => {
    // Move the window.open modification inside useEffect
    window.open = (
      (open) => (url, _, features) =>
        open.call(window, url, "_blank", features)
    )(window.open);
  }, []);

  const pathname = usePathname();
  const { address, contract } = useContract(
    pathname.includes("flip") ? "COIN" : "ROULETTE"
  );
  // const { contractBalance: houseBalance } = useGetContractBalance(contract.contractAddress);
  // const { contractBalance: walletBalance } = useGetContractBalance(account?.address || '');
  const { contractBalance: houseBalance } = useGetContractBalance(
    contract.contractAddress,
    "COIN"
  );
  const { contractBalance: walletBalance } = useGetContractBalance(
    address as string,
    "COIN"
  );
  // console.log(houseBalance, walletBalance);

  return (
    <_ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="font-heading text-xl"
                    type="button"
                  >
                    CONNECT WALLET-TEST
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="font-heading text-xl"
                    variant="destructive"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex md:flex-row flex-col justify-center items-center gap-4">
                  <div className="flex">
                    <div className="flex gap-3 justify-center items-center">
                      <h3 className="font-heading">HOUSE BALANCE</h3>
                      <Image
                        src="/svg/head.svg"
                        alt="head"
                        width={30}
                        height={30}
                      />
                      <span className="text-primary">
                        {Math.floor((Number(houseBalance) * 100) / 100)}
                      </span>
                    </div>
                    <div className="flex gap-3 justify-center items-center">
                      <h3 className="font-heading">WALLET</h3>
                      <Image
                        src="/svg/head.svg"
                        alt="head"
                        width={30}
                        height={30}
                      />
                      <span className="text-primary">
                        {Math.floor((Number(walletBalance) * 100) / 100)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl flex items-center mr-2">
                      {account.displayName}
                    </span>
                    <Button
                      className="font-heading text-xl"
                      onClick={openAccountModal}
                    >
                      DISCONNECT
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </_ConnectButton.Custom>
  );
};
