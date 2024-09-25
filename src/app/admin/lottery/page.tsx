"use client";
import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { Button, Input, Card, CardHeader, CardContent, Select } from "@/components/ui/";
import * as contract from "@/../contract.json";
import { useContract } from "@/hooks/use-contract";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useTonAddress } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { Header } from "../header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestHouseBalance } from "@/services/helpers/flipHelper";
import {
  requestForceCompleteLottery,
  requestRunLottery,
  requestStartLottery,
} from "@/services/helpers/lotteryHelper";

interface Lottery {
  id: number;
  prizePool: number;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  winner: string;
  status: number; // 0: NotStarted, 1: Open, 2: Closed, 3: Completed
  // Add other properties as needed
}

const AdminDashboard = () => {
  const {
    smartContract,
    error: contractError,
    getBalance,
  } = useContract("LOTTERY");
  const address = useTonAddress();
  const router = useRouter();
  const [activeLotteries, setActiveLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState("");
  const [prizePool, setPrizePool] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [newAdminWallet, setNewAdminWallet] = useState("");
  const [houseBalance, setHouseBalance] = useState(0);
  const [pastLotteries, setPastLotteries] = useState<Lottery[]>([]);
  const [runLotteryId, setRunLotteryId] = useState(0);
  const [forceCompleteLotteryId, setForceCompleteLotteryId] = useState(0);
  useEffect(() => {
    const fetchHouseBalance = async () => {
      const balance = await requestHouseBalance();
      setHouseBalance(balance);
    };

    fetchHouseBalance();
  }, []);

  // const checkOwner = async () => {
  //   if (smartContract && address) {
  //     console.log("insid here");

  //     try {
  //       const owner = await smartContract.adminWallet();
  //       console.log("OWNER", owner);

  //       if (owner.toLowerCase() !== address.toLowerCase()) {
  //         router.push("/");
  //       }
  //     } catch (error) {
  //       console.error("Error checking owner:", error);
  //     }
  //   }
  // };

  // //TODO: UNcomment this
  // useEffect(() => {
  //   checkOwner();
  // }, [address, smartContract]);
  //TODO: UNcomment this

  // useEffect(() => {
  //   const fetchActiveLotteries = async () => {
  //     if (smartContract) {
  //       try {
  //         const lotteries = await smartContract?.getAllLotteries();
  //         console.log("lottries", lotteries);

  //         setActiveLotteries(
  //           lotteries.filter((lottery) => lottery.status != 3)
  //         );
  //       } catch (error) {
  //         console.error("Error fetching active lotteries:", error);
  //       }
  //     }
  //   };

  //   const fetchContractBalance = async () => {
  //     const balance = await getBalance(smartContract?.address);
  //     setContractBalance(balance);
  //   };
  //   // const fetchPastLotteries = async () => {
  //   //   if (smartContract) {
  //   //     try {
  //   //       const lotteries = await smartContract.getAllLotteries();
  //   //       const completedLotteries = lotteries.filter(
  //   //         (lottery) => lottery.status === 3
  //   //       ); // Assuming 3 is the "Completed" status
  //   //       setPastLotteries(completedLotteries);
  //   //     } catch (error) {
  //   //       console.error("Error fetching past lotteries:", error);
  //   //     }
  //   //   }
  //   // };
  //   fetchActiveLotteries();
  //   fetchContractBalance();
  //   // fetchPastLotteries();
  // }, [smartContract]);

  // const handleSelectLottery = (lotteryId) => {
  //   setSelectedLottery(lotteryId);
  // };

  const handleStartLottery = async () => {
    try {
      const res = await requestStartLottery(
        prizePool,
        ticketPrice,
        totalTickets
      );
      toast.success("Lottery started successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error starting lottery:", error);
    }
  };

  const handleRunLottery = async () => {
    try {
      const res = await requestRunLottery(runLotteryId);
      toast.success("Lottery run successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error running lottery:", error);
    }
  };

  const handleForceCompleteLottery = async () => {
    try {
      const res = await requestForceCompleteLottery(forceCompleteLotteryId);
      toast.success("Lottery set to completed successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error force completing lottery:", error);
    }
  };

  // const handleWithdrawFunds = async () => {
  //   try {
  //     const tx = await smartContract?.withdrawFunds();
  //     await tx.wait();
  //     toast.success("Funds withdrawn successfully!");
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error withdrawing funds:", error);
  //   }
  // };

  // const handleSetAdminWallet = async () => {
  //   try {
  //     const tx = await smartContract?.setAdminWallet(newAdminWallet);
  //     await tx.wait();
  //     toast.success("Admin wallet set successfully!");
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error setting admin wallet:", error);
  //   }
  // };

  if (contractError) {
    return <div className="text-red-500">{contractError}</div>;
  }

  // if (!smartContract) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="h-fit p-8 bg-gray-600">
      <Toaster />
      <Header />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* <p className="mb-4">Connected Address: {address}</p> */}
      <p className="mb-4">Contract Balance: {houseBalance} USDC</p>

      <Card className="mb-4">
        <CardHeader>Start New Lottery</CardHeader>
        <CardContent>
          <div className="mb-2">
            <label htmlFor="prizePool" className="block mb-1">
              Prize Pool (USDC)
            </label>
            <Input
              id="prizePool"
              type="text"
              placeholder="Prize Pool (USDC)"
              value={prizePool}
              onChange={(e) => setPrizePool(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="ticketPrice" className="block mb-1">
              Ticket Price (USDC)
            </label>
            <Input
              id="ticketPrice"
              type="text"
              placeholder="Ticket Price (USDC)"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="totalTickets" className="block mb-1">
              Total Tickets
            </label>
            <Input
              id="totalTickets"
              type="text"
              placeholder="Total Tickets"
              value={totalTickets}
              onChange={(e) => setTotalTickets(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleStartLottery}>Start Lottery</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Run Lottery</CardHeader>
        <CardContent>
          <div className="w-full flex flex-wrap mb-4">
            <label htmlFor="runLotteryId" className="block mb-1">
              Lottery ID
            </label>
            <Input
              id="runLotteryId"
              type="number"
              placeholder="Lottery ID"
              value={runLotteryId}
              onChange={(e) => setRunLotteryId(Number(e.target.value))}
              className="mb-2"
            />
            <Button onClick={handleRunLottery}>Run Lottery</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Force Complete Lottery</CardHeader>
        <CardContent>
          <div className="w-full flex flex-wrap mb-4">
            <label htmlFor="forceCompleteLotteryId" className="block mb-1">
              Lottery ID
            </label>
            <Input
              id="forceCompleteLotteryId"
              type="number"
              placeholder="Lottery ID"
              value={forceCompleteLotteryId}
              onChange={(e) =>
                setForceCompleteLotteryId(Number(e.target.value))
              }
              className="mb-2"
            />
            <Button onClick={handleForceCompleteLottery}>
              Force Complete Lottery
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="mb-4">
        <CardHeader>Withdraw Funds</CardHeader>
        <CardContent>
          <Button onClick={handleWithdrawFunds}>Withdraw Funds</Button>
        </CardContent>
      </Card> */}

      {/* <Card className="mb-4">
        <CardHeader>Set Admin Wallet</CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="New Admin Wallet Address"
            value={newAdminWallet}
            onChange={(e) => setNewAdminWallet(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleSetAdminWallet}>Set Admin Wallet</Button>
        </CardContent>
      </Card> */}
      {/* <div className="space-y-6">
        <Card>
          <CardHeader>Past Lotteries</CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Ticket Price</TableHead>
                  <TableHead>Total Tickets</TableHead>
                  <TableHead>Sold Tickets</TableHead>
                  <TableHead>Winner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastLotteries.map((lottery) => (
                  <TableRow key={lottery.id.toString()}>
                    <TableCell>{lottery.id.toString()}</TableCell>
                    <TableCell>
                      BNB
                    </TableCell>
                    <TableCell>
                       BNB
                    </TableCell>
                    <TableCell>{lottery.totalTickets.toString()}</TableCell>
                    <TableCell>{lottery.soldTickets.toString()}</TableCell>
                    <TableCell>{lottery.winner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
