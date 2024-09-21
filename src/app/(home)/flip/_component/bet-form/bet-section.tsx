"use client";
import { CoinFace } from "@/components/coin-face";
import { statusDialogRefFunc } from "@/components/status-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCoinFip } from "@/hooks/use-coin-flip";
import { formatTwoDigit } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { Schema } from ".";
import {
  requestFlipCoin,
  requestHouseBalance,
} from "@/services/helpers/flipHelper";
import { getHouseBalance } from "@/services/flipService";

interface BetSelectionProps {
  form: UseFormReturn<Schema>;
  fiatRate: number;
}

export const BetSelection = ({ form, fiatRate }: BetSelectionProps) => {
  const [loading, setLoading] = useState(false);
  const { AudioEl, audioRef } = useCoinFip();
  const [houseBalance, setHouseBalance] = useState(0);
  const onSubmit = async (value: Schema) => {
    setLoading(true);
    try {
      const selection = value.coinSide === "head" ? 0 : 1;
      const amountBet = Number(value.wager);

      const response = await requestFlipCoin(selection, amountBet);

      const { gameId } = response;
      console.log("Game started with ID:", gameId);

      statusDialogRefFunc.toggleModal(true, "COIN");
      audioRef?.play();
    } catch (err) {
      console.log("failed coin flip", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHouseBalance = async () => {
      const balance = await requestHouseBalance();
      setHouseBalance(balance);
    };

    fetchHouseBalance();
  }, []);

  return (
    <Card className="bg-shade py-1">
      <CardHeader>
        <h3 className="font-sans">Make Your Bet</h3>
      </CardHeader>
      <Card className="h-[calc(100%_-_72px)]  bg-shade border-none flex justify-center items-center flex-col">
        <div className="max-w-[360px] w-full">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <FormField
                name="wager"
                control={form.control}
                render={({ field }) => {
                  const maxWager = houseBalance * 0.1; // This should be fetched from the backend

                  return (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel
                          htmlFor="wager"
                          className="font-bold text-gray-500"
                        >
                          Wager
                        </FormLabel>
                        <span className="font-bold">
                          {formatTwoDigit(field.value || 0)} BNB
                        </span>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            className="rounded"
                            id="wager"
                            placeholder="10"
                            {...field}
                            onChange={(e) => {
                              const inputValue = Number(e.currentTarget.value);
                              const constrainedValue = Math.min(
                                inputValue,
                                maxWager
                              );
                              field.onChange(constrainedValue);
                              form.setValue(
                                "maxPayout",
                                constrainedValue * 1.881
                              );
                            }}
                          />
                          <CoinFace.Head
                            width={20}
                            height={20}
                            className="absolute right-2 top-2"
                          />
                        </div>
                      </FormControl>
                      <div className="text-red-500 text-sm mt-1">
                        Max allowable wager: {maxWager} BNB
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            {/* ... other form fields ... */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <Button
                className="font-heading text-xl w-full"
                type="submit"
                isLoading={loading}
              >
                {loading ? "" : "FLIP"}
              </Button>
            </form>
          </div>
        </div>
      </Card>
      <AudioEl />
    </Card>
  );
};
