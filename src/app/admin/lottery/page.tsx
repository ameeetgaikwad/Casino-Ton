"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Button, Input, Card, CardHeader, CardContent, Select } from "@/components/ui/";
import * as contract from "@/../contract.json";
import { useContract } from "@/hooks/use-contract";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Header } from "../header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { smartContract, error: contractError, getBalance } = useContract("LOTTERY");
  const { address } = useAccount();
  const router = useRouter();
  const [activeLotteries, setActiveLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [newAdminWallet, setNewAdminWallet] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [pastLotteries, setPastLotteries] = useState<Lottery[]>([]);

  const checkOwner = async () => {
    if (smartContract && address) {
      console.log("insid here");

      try {
        const owner = await smartContract.adminWallet();
        console.log("OWNER", owner);

        if (owner.toLowerCase() !== address.toLowerCase()) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    }
  };

  // //TODO: UNcomment this
  // useEffect(() => {
  //   checkOwner();
  // }, [address, smartContract]);
  //TODO: UNcomment this

  useEffect(() => {
    const fetchActiveLotteries = async () => {
      if (smartContract) {
        try {
          const lotteries = await smartContract?.getAllLotteries();
          console.log("lottries", lotteries);

          setActiveLotteries(lotteries.filter((lottery) => lottery.status != 3));
        } catch (error) {
          console.error("Error fetching active lotteries:", error);
        }
      }
    };

    const fetchContractBalance = async () => {
      const balance = await getBalance(smartContract?.address);
      setContractBalance(balance);
    };
    const fetchPastLotteries = async () => {
      if (smartContract) {
        try {
          const lotteries = await smartContract.getAllLotteries();
          const completedLotteries = lotteries.filter((lottery) => lottery.status === 3); // Assuming 3 is the "Completed" status
          setPastLotteries(completedLotteries);
        } catch (error) {
          console.error("Error fetching past lotteries:", error);
        }
      }
    };
    fetchActiveLotteries();
    fetchContractBalance();
    // fetchPastLotteries();
  }, [smartContract]);

  const handleSelectLottery = (lotteryId) => {
    setSelectedLottery(lotteryId);
  };

  const handleStartLottery = async () => {
    try {
      const tx = await smartContract?.startLottery(
        prizePool,
        ticketPrice,
        totalTickets
      );
      await tx.wait();
      toast.success("Lottery started successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error starting lottery:", error);
    }
  };

  const handleRunLottery = async () => {
    try {
      const tx = await smartContract?.runLottery(selectedLottery);
      await tx.wait();
      toast.success("Lottery run successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error running lottery:", error);
    }
  };

  const handleForceCompleteLottery = async () => {
    try {
      const tx = await smartContract?.forceCompleteLottery(selectedLottery);
      await tx.wait();
      toast.success("Lottery set to completed successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error force completing lottery:", error);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      const tx = await smartContract?.withdrawFunds();
      await tx.wait();
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error withdrawing funds:", error);
    }
  };

  const handleSetAdminWallet = async () => {
    try {
      const tx = await smartContract?.setAdminWallet(newAdminWallet);
      await tx.wait();
      toast.success("Admin wallet set successfully!");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error setting admin wallet:", error);
    }
  };

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
      <p className="mb-4">Connected Address: {address}</p>
      <p className="mb-4">Contract Balance: {contractBalance} BNB</p>

      <Card className="mb-4">
        <CardHeader>Start New Lottery</CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Prize Pool (bnb)"
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Ticket Price (bnb)"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Total Tickets"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleStartLottery}>Start Lottery</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Manage Active Lotteries</CardHeader>
        <CardContent>
          <div className="w-full flex flex-wrap mb-4">
            {activeLotteries?.map((lottery, index) => (
              <Button
                key={index}
                onClick={() => handleSelectLottery(lottery.id?.toString() ?? index.toString())}
                variant={selectedLottery === (lottery.id?.toString() ?? index.toString()) ? "default" : "outline"}
                className="w-fit m-4 font-  h-fit flex flex-wrap text-white border-2 border-white"
              >
                <div className="flex flex-col">
                  <span>Lottery #{lottery.id?.toString() ?? index.toString()}</span>
                  <span>PrizePool {lottery.prizePool?.toString() ?? index.toString()}</span>
                  <span>Sold {`${lottery.soldTickets?.toString()} / ${lottery.totalTickets?.toString()}`}</span>
                </div>
              </Button>
            ))}
          </div>
          {selectedLottery && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleRunLottery} className="flex-1">
                Run Lottery
              </Button>
              <Button onClick={handleForceCompleteLottery} className="flex-1">
                Complete Lottery
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Withdraw Funds</CardHeader>
        <CardContent>
          <Button onClick={handleWithdrawFunds}>Withdraw Funds</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
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
      </Card>
      <div className="space-y-6">
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
                    <TableCell>{ethers.utils.formatEther(lottery.prizePool)} BNB</TableCell>
                    <TableCell>{ethers.utils.formatEther(lottery.ticketPrice)} BNB</TableCell>
                    <TableCell>{lottery.totalTickets.toString()}</TableCell>
                    <TableCell>{lottery.soldTickets.toString()}</TableCell>
                    <TableCell>{lottery.winner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
