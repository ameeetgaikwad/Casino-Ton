"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import BigNumber from "bignumber.js";

import { CoinFace } from "@/components/coin-face";
import { StatusDialog, statusDialogRef, statusDialogRefFunc } from "@/components/status-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContract, useGetTotalWager } from "@/hooks/use-contract";
import { useRouletteContractListener } from "@/hooks/use-contract-listener";
import { useGetContractBalance } from "@/hooks/use-get-contract-balance";
import { cutDecimal, stringFormat } from "@/lib/contract";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { NumberPanel } from "./number-panel";
import { useRoulette } from "./store";
import { useRouletteSound } from "@/hooks/use-roulette-sound";

// Define the RPC endpoint
const rpcEndpoint = process.env.NEXT_PUBLIC_BSC_RPC_URL;

// Create an instance of the Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);

export const Form = observer(() => {
  const [loading, setLoading] = useState(false);
  const store = useRoulette();
  const { smartContract, address, contract } = useContract("ROULETTE");
  const { totalWager } = useGetTotalWager(address as string, "ROULETTE");
  const { contractBalance } = useGetContractBalance(contract.contractAddress);
  const { AudioEl, audioRef } = useRouletteSound();
  const maxWager = useMemo(
    () => (contractBalance ? (parseFloat(contractBalance) * 0.09).toFixed(4) : 0),
    [contractBalance]
  );

  const { isPending } = useRouletteContractListener(address as string, smartContract);
  const play = useCallback(async () => {
    setLoading(true);
    let transactionFinished = false;
    try {
      const { amount, guess, guessType } = store.result;
      console.log("here 1");
      if (!amount.length) {
        throw new Error("At least one bet.");
      }
      if (!address) {
        throw new Error(`Connect Wallet`);
      }
      if (!smartContract) {
        throw new Error(`Contract not initialized`);
      }
      if (store.totalWager > Number(maxWager)) {
        throw new Error(`Wager cannot be greater than ${maxWager}`);
      }
      console.log("here 2");
      // Fetch current gas price
      const currentGasPriceInWei = await provider.getGasPrice();
      const currentGasPriceInGwei = ethers.utils.formatUnits(currentGasPriceInWei, "gwei");

      const option = {
        gasLimit: 10000000,
        gasPrice: ethers.utils.parseUnits(currentGasPriceInGwei, "gwei"),
        value: ethers.utils.parseEther(store.totalWager.toString()),
      };
      const tx = await smartContract.roulette(guess, guessType, amount, option);
      console.log(tx);
      statusDialogRefFunc.toggleModal(true, "ROULETTE");
      // Start playing the sound
      audioRef?.play();
      store.clearAllChipItems();

      // Check if transaction is finished
      await tx.wait();
      console.log(tx);
      transactionFinished = true;
    } catch (err: Error | any) {
      toast.error((err as Error)?.message ?? "An error occurred");
    } finally {
      setLoading(false);
      // Stop playing the sound if transaction is finished or an error occurred
      if (transactionFinished || !loading) {
        audioRef?.pause();
      } else {
        // If transaction is not finished, play audio in a loop
        const loopInterval = setInterval(() => {
          audioRef?.play();
        }, 1000); // Adjust interval as needed

        // Stop the loop when the condition is met
        const checkModalInterval = setInterval(() => {
          console.log("hfhfhfhf");
          if (statusDialogRef.current?.isOpen("ROULETTE")) {
            clearInterval(loopInterval);
            clearInterval(checkModalInterval);
          }
        }, 1000); // Adjust interval as needed
      }
    }
  }, [store, address, smartContract, maxWager, loading]);

  const amount = useMemo(() => {
    let finalAmount = 0;
    const { amount, guessType } = store.result;
    for (const [i, g] of amount.entries()) {
      const _g = Number(g) / 1e18;
      finalAmount += guessType[i] === 0 ? _g * 35 : _g * 1.88;
    }
    return finalAmount.toFixed(2);
  }, [store.result]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full ">
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
        <Card className="h-[calc(100%_-_72px)]  bg-shade border-none flex justify-center items-center flex-col">
          <div className="sm:w-[360px]">
            <div>
              <div className="flex mb-2 justify-between items-center font-bold">
                <div className="text-grey-60 text-sm font-bold">Wager</div>
                <div className="text-sm">
                  <span className="text-white">{store.totalWager.toString()}</span>
                  &nbsp;BNB
                </div>
              </div>

              <div className="relative">
                <Input className="rounded" value={store.totalWager.toString()} onChange={() => {}} readOnly />
                <CoinFace.Head width={20} height={20} className="absolute right-2 top-2" />
                <div className="text-red-500 text-sm mt-1">Max allowable wager: {maxWager} BNB</div>
              </div>

              <div className={cn("grid gap-3 mt-5", `grid-cols-5`)}>
                {store.chip.map((chip, idx) => (
                  <div
                    key={idx}
                    className={cn("p-2 rounded-lg cursor-pointer", store.selectedChip === chip && "bg-slate-400")}
                    onClick={() => store.updateSelectedChip(chip)}
                  >
                    <img src={`/assets/imgs/roulette/wager-${idx + 1}.png`} alt={`wager-${idx + 1}`} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-grey-60 text-sm mt-6 mb-2 font-bold">Max Payout</div>

                  <div className="relative">
                    <Input type="text" className="rounded" readOnly onChange={() => {}} value={Number(amount)} />
                    <CoinFace.Head width={20} height={20} className="absolute right-2 top-2" />
                  </div>
                </div>
                <div>
                  <div className="text-grey-60 text-sm mt-6 mb-2 font-bold">Total Wager</div>

                  <div className="relative">
                    <Input type="text" className="rounded" readOnly onChange={() => {}} value={totalWager ?? 0} />
                    <CoinFace.Head width={20} height={20} className="absolute right-2 top-2" />
                  </div>
                </div>
              </div>
              <Button className="font-heading mt-6 text-xl w-full" onClick={play} isLoading={loading || isPending}>
                {loading || isPending ? "" : "SPIN THE WHEEL"}
              </Button>
            </div>
          </div>
        </Card>
        <AudioEl />
      </Card>
    </div>
  );
});
