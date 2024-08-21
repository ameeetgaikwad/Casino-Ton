"use client";
import { ConnectButton } from "@/components/connect-button";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useRoulette } from "./store";
import { InferSelectModel } from "drizzle-orm";
import { schema } from "@/lib/db";

interface HeaderProps {
  lastTenOutcome: Pick<InferSelectModel<typeof schema.transactionHistory>, "outcome">[];
}

export const Header = observer(({ lastTenOutcome }: HeaderProps) => {
  const { pad } = useRoulette();
  return (
    <header className="flex place-items-start justify-between ">
      <div className="hidden md:flex  gap-4 items-center">
        <h3 className="text-m">Last 10 Results</h3>
        <div className="flex gap-1">
          {lastTenOutcome
            .map(({ outcome }) => pad.find((p) => p.value == outcome))
            .filter(Boolean)
            .map((item, key) => {
              return (
                <div
                  className={cn(
                    "px-2 py-1 aspect-square grid-cols-1",
                    "hover:number-hover",
                    "button-style",
                    Number(item?.value) === 0 ? "" : Number(item?.value) % 2 === 0 ? "bg-[#1f2737]" : "bg-[#c72f40]"
                  )}
                  style={{
                    backgroundColor: Number(item?.value) === 0 ? item?.color : undefined,
                  }}
                  key={key}
                >
                  {item?.label}
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex gap-16">
        <ConnectButton />
      </div>
    </header>
  );
});
