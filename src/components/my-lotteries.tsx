"use client";
import { CoinFace } from "@/components/coin-face";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, shortContractAddress } from "@/lib/utils";
import { useCopyToClipboard } from "usehooks-ts";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

type MyLotteriesProps = {
  lotteryId: number;
  ticketsPurchased: number;
  ticketPrice: number;
  status: number;
  remainingTickets: number;
  prizePool: number;
  winner: string;
};

export function MyLotteries({
  records,
  allLotteries,
}: {
  records: MyLotteriesProps[] | [];
  allLotteries: MyLotteriesProps[] | [];
}) {

  const [_, copy] = useCopyToClipboard();
  const [myLotteriesSelected, setMyLotteriesSelected] = useState(true);

  const [currLotteries, setCurrLotteries] =
    useState<MyLotteriesProps[]>(records);

  useEffect(() => {
    if (myLotteriesSelected) {
      setCurrLotteries(records);
    } else {
      setCurrLotteries(allLotteries);
    }
  }, [myLotteriesSelected, records, allLotteries]);

  const { address } = useAccount();

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
            </TableRow>
          </TableHeader>
          <TableBody className="font-bold">
            {currLotteries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  //   className="h-24 text-center  text-xl font-heading text-pretty text-primary"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              currLotteries.map((record, key) => (
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
                  <TableCell>{record.status == 1 ? "Active" : record.status == 2 ? "Closed" : " Completed"}</TableCell>
                  <TableCell>{record.remainingTickets}</TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.prizePool}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      {record.status != 3 ? "Yet to decide" : shortContractAddress(record.winner)}
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
