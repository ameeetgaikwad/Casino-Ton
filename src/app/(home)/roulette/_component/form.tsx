"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CoinFace } from "@/components/coin-face";
import { StatusDialog, statusDialogRefFunc } from "@/components/status-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { NumberPanel } from "./number-panel";
import { useRoulette } from "./store";
import { useRouletteSound } from "@/hooks/use-roulette-sound";
import { requestPlayRoulette } from "@/services/helpers/rouletteHelper";
import { requestHouseBalance } from "@/services/helpers/flipHelper";
import { getUserBalance } from "@/services/helpers/authHelper";

export const Form = observer(() => {
  const [loading, setLoading] = useState(false);
  const store = useRoulette();
  const { AudioEl, audioRef } = useRouletteSound();
  const [maxWager, setMaxWager] = useState(0);

  // Fetch max wager from the server
  useEffect(() => {
    const fetchHouseBalance = async () => {
      const balance = await requestHouseBalance();
      setMaxWager(balance * 0.1);
    };

    fetchHouseBalance();
  }, []);

  const play = useCallback(async () => {
    setLoading(true);
    try {
      const { guess, guessType, amount } = store.result;
      if (!amount.length) {
        throw new Error("At least one bet.");
      }
      if (store.totalWager > maxWager) {
        throw new Error(`Wager cannot be greater than ${maxWager}`);
      }
      console.log("entered wayyy back");
      const result = await requestPlayRoulette(
        guess.map((g) => Number(g)),
        guessType,
        amount.map((a) => Number(a))
      );

      statusDialogRefFunc.toggleModal(true, "ROULETTE");
      setTimeout(() => {
        statusDialogRefFunc.toggleModal(false, "COIN");
        // Display game result
        if (result.winner) {
          toast.success(`You won! Payout: ${result.payout} USDC`);
        } else {
          toast.error("You lost. Better luck next time!");
        }
        // Update house balance
        getUserBalance();
      }, 2000);

      audioRef?.play();
      store.clearAllChipItems();

      // Handle the result
      console.log(result);
      // You might want to update the store or show a success message here
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      audioRef?.pause();
    }
  }, [store, maxWager, audioRef]);

  return (
    <div className="md:grid flex flex-col md:grid-cols-3 gap-8 h-full ">
      <Card className="bg-shade py-1 md:px-2  col-span-2">
        <CardHeader>
          <h3>Make Your Selection</h3>
        </CardHeader>
        <CardContent className=" p-[41px]">
          <div className="bg-[#256843] rounded-[40px] md:p-3 2xl:p-5">
            <div className="bg-[#19492E] rounded-xl md:rounded-[40px] p-2 md:p-6 2xl:p-10 ">
              <NumberPanel />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-shade py-1 ">
        <CardHeader>
          <h3 className="font-sans">Place Your Bet</h3>
        </CardHeader>
        <Card className="h-[calc(100%_-_72px)]  bg-shade border-none flex justify-center items-center flex-col px-2">
          <div className="">
            <div>
              <div className="flex mb-2 justify-between items-center font-bold">
                <div className="text-grey-60 text-sm font-bold">Wager</div>
                <div className="text-sm">
                  <span className="text-white">
                    {store.totalWager.toString()}
                  </span>
                  &nbsp;USDC
                </div>
              </div>

              <div className="relative">
                <Input
                  className="rounded"
                  value={store.totalWager.toString()}
                  onChange={() => {}}
                  readOnly
                />
                <CoinFace.Head
                  width={20}
                  height={20}
                  className="absolute right-2 top-2"
                />
                <div className="text-red-500 text-sm mt-1">
                  Max allowable wager: {maxWager} USDC
                </div>
              </div>

              <div className={cn("grid gap-3 mt-5", `grid-cols-5`)}>
                {store.chip.map((chip, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-2 rounded-lg cursor-pointer",
                      store.selectedChip === chip && "bg-slate-400"
                    )}
                    onClick={() => store.updateSelectedChip(chip)}
                  >
                    <img
                      src={`/assets/imgs/roulette/wager-${idx + 1}.png`}
                      alt={`wager-${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* ... (rest of the component remains the same) ... */}

              <Button
                className="font-heading mt-6 text-xl w-full"
                onClick={play}
                isLoading={loading}
              >
                {loading ? "" : "SPIN THE WHEEL"}
              </Button>
            </div>
          </div>
        </Card>
        <AudioEl />
      </Card>
    </div>
  );
});
