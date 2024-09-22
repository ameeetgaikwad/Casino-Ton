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
import { TransactionHistoryI } from "@/drizzle/schema";
import { cn, shortContractAddress } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "timeago.js";
import { useCopyToClipboard } from "usehooks-ts";

interface TransactionHistoryProps {
  records: TransactionHistoryI[];
}

export function TransactionHistory({ records }: TransactionHistoryProps) {
  const [_, copy] = useCopyToClipboard();
  return (
    <Card className="bg-shade mt-8">
      <CardHeader>Bet History</CardHeader>
      <CardContent>
        <Table className=" border-none">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Player</TableHead>
              <TableHead className="w-[100px]">Transaction</TableHead>
              <TableHead>Played</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Wager</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-bold">
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center  text-xl font-heading text-pretty text-primary"
                >
                  No recoders found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, key) => (
                <TableRow
                  key={key}
                  className={cn(
                    record.isWin ? "text-green-500" : "text-destructive"
                  )}
                >
                  <TableCell>{shortContractAddress(record.player)}</TableCell>
                  <TableCell
                    className="flex gap-2"
                    onClick={async () => {
                      await copy(record.transaction);
                      toast.info("Copied successfully.", { duration: 1500 });
                    }}
                  >
                    {shortContractAddress(record.transaction)}{" "}
                    <span className="icon-[ion--copy] cursor-pointer" />
                  </TableCell>
                  <TableCell>
                    {record.createdAt &&
                      format(record.createdAt?.toLocaleString())}
                  </TableCell>
                  <TableCell>{record.outcome}</TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.wager}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.payout}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-right justify-right gap-2">
                      <CoinFace.Head width={20} height={20} />
                      {record.profit}
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
