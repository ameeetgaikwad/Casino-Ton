"use client";
import { CoinFace } from "@/components/coin-face";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, shortContractAddress } from "@/lib/utils";
import { useCopyToClipboard } from "usehooks-ts";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  requestActiveLotteries,
  requestBuyTickets,
  requestMyLotteries,
} from "@/services/helpers/lotteryHelper";
import type { Lottery } from "@/drizzle/schema";
import { useTonAddress } from "@tonconnect/ui-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { DepositLinkComponent } from "./depositLinkComponent";

export function MyLotteries() {
  const [_, copy] = useCopyToClipboard();
  const [myLotteriesSelected, setMyLotteriesSelected] = useState(true);

  const [allLotteries, setAllLotteries] = useState<Lottery[]>();
  const [myLotteries, setMyLotteries] = useState<Lottery[]>();

  const currLotteries = myLotteriesSelected ? myLotteries : allLotteries;
  const address = useTonAddress();

  useEffect(() => {
    requestActiveLotteries().then((res) => {
      setAllLotteries(res);
    });
  }, [address]);

  useEffect(() => {
    if (address) {
      requestMyLotteries(address).then((res) => {
        setMyLotteries(res);
      });
    }
  }, [address]);

  const handleBuyTickets = async (
    lotteryId: number,
    numberOfTickets: number,
    playerAddress: string
  ) => {
    try {
      toast.loading("Purchasing tickets...");
      const res = await requestBuyTickets(
        lotteryId,
        numberOfTickets,
        playerAddress
      );
      toast.dismiss();
      toast.success("Tickets purchased successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to purchase tickets");
    }
  };

  return (
    <Card className="bg-shade mt-8 text-center">
      <CardHeader className="font-bold text-2xl">
        <div className="flex space-x-5 text-center">
          <span>My Lotteries</span>
          <div>
            <Switch
              checked={!myLotteriesSelected}
              onCheckedChange={() =>
                setMyLotteriesSelected(!myLotteriesSelected)
              }
            />
          </div>
          <span>All Lotteries</span>
        </div>
        <div className="flex justify-start">
          <DepositLinkComponent />
        </div>
      </CardHeader>
      <CardContent>
        <Table className="border-none text-left text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Lottery ID</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Per Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Prize Pool</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-bold">
            {currLotteries && currLotteries?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  //   className="h-24 text-center  text-xl font-heading text-pretty text-primary"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              currLotteries?.map((record) => (
                <TableRow
                  key={record.id}
                  className={cn(
                    "text-yellow-500",
                    record?.winner?.toLowerCase() === address?.toLowerCase()
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  <TableCell>#{record.id}</TableCell>
                  <TableCell
                  // className="text-center"
                  >
                    {record.soldTickets}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {Number(record.ticketPrice) /
                        10 ** Number(process.env.NEXT_PUBLIC_USDC_DECIMALS)}
                    </div>
                  </TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>
                    {record.totalTickets - record.soldTickets}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {Number(record.prizePool) /
                        10 ** Number(process.env.NEXT_PUBLIC_USDC_DECIMALS)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      {shortContractAddress(record.winner ?? "")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="p-1 text-xs font-light"
                      onClick={() => {
                        handleBuyTickets(record.id, 1, address);
                      }}
                      disabled={record.status !== "OPEN"}
                    >
                      Buy Lottery
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
