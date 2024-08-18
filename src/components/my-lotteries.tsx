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
import { InferSelectModel, schema } from "@/lib/db";
import { cn, shortContractAddress } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "timeago.js";
import { useCopyToClipboard } from "usehooks-ts";
import { useAccount } from "wagmi";
import { useState } from "react";

type MyLotteriesProps = {
  lotteryId: number;
  ticketsPurchased: number;
  ticketPrice: number;
  status: number;
  remainingTickets: number;
  prizePool: number;
  winner: string;
};

export function MyLotteries({ records }: { records: MyLotteriesProps[] | [] }) {
  const [_, copy] = useCopyToClipboard();

  const { address } = useAccount();
  console.log(records);

  return (
    <Card className="bg-shade mt-8 text-center">
      <CardHeader className="font-bold">My Lotteries</CardHeader>
      <CardContent>
        <Table className="border-none text-left">
          <TableHeader>
            <TableRow>
              <TableHead>Lottery ID</TableHead>
              <TableHead>MyTickets</TableHead>
              <TableHead>Per Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Prize Pool</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-bold">
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  //   className="h-24 text-center  text-xl font-heading text-pretty text-primary"
                >
                  No recoders found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, key) => (
                <TableRow
                  key={key}
                  className={cn(
                    record.winner.startsWith("0x0000000")
                      ? "text-yellow-500"
                      : record.winner.toLowerCase() === address
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  <TableCell>#{record.lotteryId}</TableCell>
                  <TableCell
                  // className="text-center"
                  >
                    {record.ticketsPurchased}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.ticketPrice}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.status == 1
                      ? "Active"
                      : record.status == 2
                      ? "Closed"
                      : " Completed"}
                  </TableCell>
                  <TableCell>{record.remainingTickets}</TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.prizePool}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      {record.status != 3
                        ? "Yet to decide"
                        : shortContractAddress(record.winner)}
                    </div>
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
