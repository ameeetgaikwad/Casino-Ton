"use client";

import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useRoulette } from "./store";
import { InferSelectModel } from "drizzle-orm";
// import { schema } from "@/db";
import Link from "next/link";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Roulette } from "@/drizzle/schema";
import { CustomConnectButton } from "@/components/CustomConnectButton";

interface HeaderProps {
  lastTenOutcome: Roulette[];
  isLayout?: boolean;
}

export const Header = observer(
  ({ isLayout = false, lastTenOutcome }: HeaderProps) => {
    const { pad } = useRoulette();
    return (
      <header className="flex flex-row place-items-start justify-between ">
        <div className="flex md:flex-row flex-col gap-4 items-center">
          <h3 className="text-m">Last 10 Results</h3>
          <div className="flex md:flex-row flex-col gap-1">
            {lastTenOutcome.map(({ guess, guessType }, key) => {
              if (guessType === 0) {
                return (
                  <div
                    className={cn(
                      "px-2 py-1 aspect-square grid-cols-1",
                      "hover:number-hover",
                      "button-style",
                      Number(guess) === 0
                        ? ""
                        : Number(guess) % 2 === 0
                        ? "bg-[#1f2737]"
                        : "bg-[#c72f40]"
                    )}
                    // style={{
                    //   backgroundColor:
                    //     Number(guess) === 0 ? item?.color : undefined,
                    // }}
                    key={key}
                  >
                    {guess}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </header>
    );
  }
);
