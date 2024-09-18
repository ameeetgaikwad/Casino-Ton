import { statusDialogRefFunc } from "@/components/status-dialog";
import { saveTransactionData } from "@/db/action";
import BigNumber from "bignumber.js";
import { Contract, ethers } from "ethers";
import { useEffect } from "react";
import { useTransition } from "./use-transition";
import { GameInitiatedCB, useSetupEventListener } from "@/lib/coin-flip-oracle";
import { useContract } from "./use-contract";
import { Game } from "@/../contract.json";

const provider_rpc_url = process.env.NEXT_PUBLIC_BSC_RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(provider_rpc_url);
const wallet = new ethers.Wallet(
  process.env.NEXT_PUBLIC_PRIVATE_KEY!,
  provider
);

const contractABI = Game.COIN.abi;
const contractAddress = Game.COIN.contractAddress;
const contract: Contract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet
);

export const useCoinContractListener = (
  address: string,
  contracts: Contract | undefined
) => {
  const [isPending, startTransaction] = useTransition();

  useEffect(() => {
    if (!contract) return;
    const cb = (
      playerAddress: string,
      _totalBetAmounts: BigNumber,
      guess: number,
      isWin: boolean,
      _totalPayout: BigNumber,
      _totalProfit: BigNumber,
      event: any
    ) => {
      try {
        const totalPayout = Number(BigNumber(_totalPayout).toString()) / 1e18;
        const totalBetAmounts =
          Number(BigNumber(_totalBetAmounts).toString()) / 1e18;
        const totalProfit = Number(BigNumber(_totalProfit).toString()) / 1e18;
        console.log(isWin);
        isWin
          ? statusDialogRefFunc.updateStatus("win", totalPayout)
          : statusDialogRefFunc.updateStatus("lose", totalBetAmounts);
        if (playerAddress === address) {
          startTransaction(async () => {
            try {
              await saveTransactionData(
                {
                  isWin,
                  player: address,
                  transaction: event.transactionHash,
                  wager: totalBetAmounts,
                  outcome: guess == 0 ? "HEAD" : "TAIL",
                  gameType: "COIN",
                  payout: totalPayout,
                  profit: totalProfit,
                },
                "/coin"
              );
            } catch (error) {
              console.error("Error saving transaction data:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error in DetailedGameResult callback:", error);
      }
    };

    try {
      // contract.on("GameInitiated", GameInitiatedCB);
      useSetupEventListener();
      contract.addListener("DetailedGameResult", cb);
      return () => {
        contract.removeListener("DetailedGameResult", cb);
      };
    } catch (error) {
      console.error("Error setting up contract listeners:", error);
    }
  }, [contract, address]);

  return {
    isPending,
  };
};

export const useRouletteContractListener = (
  address: string,
  contract: Contract | undefined
) => {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!contract) return;
    console.log("DEFINING CB FUNCTION FOR ROULETTE");

    const cb = (
      playerAddress: string,
      guess: number,
      _totalPayout: BigNumber,
      _totalBetAmounts: BigNumber,
      isWin: boolean,
      _totalProfit: BigNumber,
      event: any
    ) => {
      console.log("Triggered cb contract roulette");
      console.log("totalprofit", _totalProfit);
      const totalPayout = Number(BigNumber(_totalPayout).toString()) / 1e18;
      const totalBetAmounts =
        Number(BigNumber(_totalBetAmounts).toString()) / 1e18;
      const totalProfit = Number(BigNumber(_totalProfit).toString()) / 1e18;

      console.log(isWin);

      isWin
        ? statusDialogRefFunc.updateStatus("win", totalPayout, guess.toString())
        : statusDialogRefFunc.updateStatus(
            "lose",
            totalBetAmounts,
            guess.toString()
          );
      if (playerAddress === address) {
        startTransition(async () => {
          await saveTransactionData(
            {
              isWin,
              player: address,
              transaction: event.transactionHash,
              wager: totalBetAmounts,
              outcome: guess.toString(),
              gameType: "ROULETTE",
              payout: totalPayout,
              profit: isWin ? totalProfit * -1 : totalProfit,
            },
            "/roulette"
          );
        });
      }
    };
    // uint8 side, GuessType guessType, bool won, uint payout
    const helper = (
      side: number,
      guessType: number,
      won: boolean,
      payout: BigNumber,
      event: any
    ) => {
      console.log("Triggered cb contract roulette helper");
      console.log(side);
      console.log(guessType);
      console.log(won);
      console.log(payout);
      console.log(event);
      console.log("event.args", event.args);
      console.log("GAMERESULT  TRIGGERED");
    };

    const logDebug = (message: string, event: any) => {
      console.log("LOGGGG");
      console.log(message);
      console.log(event);
      console.log("event.args", event.args);
    };

    const logWonAny = (message: boolean, event: any) => {
      console.log("LOGGGG WONN ANY");
      console.log(message);
      console.log(event);
      console.log("event.args", event.args);
    };

    contract.addListener("FinalResult", cb);
    contract.addListener("GameResult", helper);
    contract.addListener("Debug", logDebug);
    contract.addListener("WonAny", logWonAny);

    console.log("DEFAULT ROULETTE EVENT LISTENER ADDED");
    return () => {
      contract.removeListener("FinalResult", cb);
      contract.removeListener("GameResult", helper);
      contract.removeListener("Debug", logDebug);
      contract.removeListener("WonAny", logWonAny);
    };
  }, [contract, address]);

  return {
    isPending,
  };
};
