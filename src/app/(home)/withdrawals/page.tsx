"use client";
import { CustomConnectButton } from "@/components/CustomConnectButton";
import { Button } from "@/components/ui/button";
import { Withdrawal } from "@/drizzle/schema";
import {
  getWithdrawHistory,
  requestWithdrawUSDC,
} from "@/services/helpers/withdrawHelper";
import { useTonAddress } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate, shortContractAddress } from "@/lib/utils";

export default function Withdrawals() {
  const [jettonAmount, setJettonAmount] = useState(0);
  const address = useTonAddress();
  const [withdrawHistory, setWithdrawHistory] = useState<Withdrawal[]>([]);
  const sendTransaction = async () => {
    if (jettonAmount === 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!jettonAmount) {
      alert("Please enter a valid amount");
      return;
    }
    toast.loading("Withdrawing USDC...");
    await requestWithdrawUSDC(Number(jettonAmount));
    toast.dismiss();
    toast.success(
      "USDC withdrawn successfully. It will be sent to your wallet in a few minutes."
    );
  };
  useEffect(() => {
    getWithdrawHistory().then((history) => {
      setWithdrawHistory(history.history);
    });
  }, [address]);

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg h-full">
        <div className="flex justify-end w-full">
          <CustomConnectButton />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Withdraw USDC</h2>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter USDC amount"
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = Math.floor(Number(e.target.value));
              if (value >= 0) {
                e.target.value = value.toString();
              } else {
                e.target.value = "0";
              }
              setJettonAmount(Number(e.target.value));
            }}
          />
          <Button
            type="button"
            onClick={sendTransaction}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Withdraw USDC
          </Button>
        </div>
        <div className="overflow-x-auto md:w-auto w-[80%]">
          <Card className="bg-shade mt-8 ">
            <CardHeader>Bet History</CardHeader>
            <CardContent>
              <Table className=" border-none">
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-[100px]">Transaction</TableHead> */}
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tx Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-bold">
                  {withdrawHistory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center  text-xl font-heading text-pretty text-primary"
                      >
                        No recoders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    withdrawHistory.map((record, key) => (
                      <TableRow
                        key={record.id}
                        className={cn(
                          record.status === "CONFIRMED" && "text-green-500",
                          record.status === "FAILED" && "text-red-500",
                          record.status === "PENDING" && "text-yellow-500"
                        )}
                      >
                        <TableCell>
                          {Number(record.value) /
                            10 ** Number(process.env.NEXT_PUBLIC_USDC_DECIMALS)}
                        </TableCell>

                        <TableCell>{record.status}</TableCell>
                        <TableCell>
                          {record.createdAt &&
                            formatDate(record.createdAt?.toLocaleString())}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://testnet.tonviewer.com/transaction/${record.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {shortContractAddress(record.txHash ?? "")}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
