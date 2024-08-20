"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Button, Input, Card, CardHeader, CardContent, Select } from "@/components/ui/";
import * as contract from "@/../contract.json";
import { useContract } from "@/hooks/use-contract";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "../(home)/lottery/_component/header";
import { Toaster, toast } from "sonner";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

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
  const { Game } = contract;
  const {
    smartContract,
    error: contractError,
    getBalance,
  } = useContract("LOTTERY");
  const { address } = useAccount();
  const router = useRouter();
  const [activeLotteries, setActiveLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [newAdminWallet, setNewAdminWallet] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkOwner = async () => {
    if (smartContract && address) {
      console.log("insid here");

      try {
        const owner = await smartContract.owner();
        if (owner.toLowerCase() !== address.toLowerCase()) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking owner:", error);
      }
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   checkOwner();
  // }, [address, smartContract]);

  useEffect(() => {
    const fetchActiveLotteries = async () => {
      if (smartContract) {
        try {
          const lotteries = await smartContract.getActiveLotteries();
          setActiveLotteries(lotteries);
        } catch (error) {
          console.error("Error fetching active lotteries:", error);
        }
      }
    };

    const fetchContractBalance = async () => {
      const balance = await getBalance(smartContract?.address);
      setContractBalance(balance);
    };

    fetchActiveLotteries();
    fetchContractBalance();
  }, [smartContract, getBalance]);

  const handleSelectLottery = (lotteryId) => {
    setSelectedLottery(lotteryId);
  };

  const handleStartLottery = async () => {
    try {
      const tx = await smartContract?.startLottery(
        ethers.utils.parseEther(prizePool),
        ethers.utils.parseEther(ticketPrice),
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
    <div className="p-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {activeLotteries.map((lottery, index) => (
              <Button
                key={index}
                onClick={() =>
                  handleSelectLottery(
                    lottery.id?.toString() ?? index.toString()
                  )
                }
                variant={
                  selectedLottery ===
                  (lottery.id?.toString() ?? index.toString())
                    ? "default"
                    : "outline"
                }
                className="w-full text-white border-2 border-white"
              >
                Lottery #{lottery.id?.toString() ?? index.toString()}
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
    </div>
  );
};

export default AdminDashboard;
