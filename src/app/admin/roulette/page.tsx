"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "@/hooks/use-contract";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useAccount } from "wagmi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Header } from "../header";

interface Game {
  address: string;
  amountBet: string;
  guess: string;
  winner: boolean;
  ethInJackpot: string;
  guessType: string;
  payout: string;
}

const RouletteAdmin = () => {
  const { smartContract, error: contractError, getBalance } = useContract("ROULETTE");
  const { address } = useAccount();
  const [contractBalance, setContractBalance] = useState("0");
  const [newHouseWallet, setNewHouseWallet] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [lastGames, setLastGames] = useState<Game[]>([]);
  const router = useRouter();

  const checkOwner = async () => {
    if (smartContract && address) {
      console.log("insid here");

      try {
        const owner = await smartContract.owner();
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
    const fetchContractData = async () => {
      if (smartContract) {
        try {
          const balance = await getBalance(smartContract.address);
          setContractBalance(balance);

          // Fetch last 5 games
          const games: Game[] = [];
          for (let i = 0; i < 5; i++) {
            try {
              const game = await smartContract.lastPlayedGames(i);
              games.push({
                address: game.addr,
                amountBet: ethers.utils.formatEther(game.amountBet),
                guess: game.guess.toString(),
                winner: game.winner,
                ethInJackpot: ethers.utils.formatEther(game.ethInJackpot),
                guessType: ["Number", "Even", "Odd"][game.guessType],
                payout: ethers.utils.formatEther(game.payout),
              });
            } catch (error) {
              // Break the loop if we've reached the end of the games array
              break;
            }
          }
          setLastGames(games);
        } catch (error) {
          console.error("Error fetching contract data:", error);
        }
      }
    };

    fetchContractData();
  }, [smartContract]);

  const handleSetHouseWallet = async () => {
    try {
      const tx = await smartContract?.setHouseWallet(newHouseWallet);
      await tx.wait();
      toast.success("House wallet updated successfully!");
      setNewHouseWallet("");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error setting house wallet:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = ethers.utils.parseEther(withdrawAmount);
      const tx = await smartContract?.withdraw(amount);
      await tx.wait();
      toast.success(`${withdrawAmount} ETH withdrawn successfully!`);
      setWithdrawAmount("");
      const newBalance = await getBalance(smartContract?.address);
      setContractBalance(newBalance);
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error withdrawing funds:", error);
    }
  };

  const handleWithdrawAll = async () => {
    try {
      const tx = await smartContract?.withdrawAll();
      await tx.wait();
      toast.success("All funds withdrawn successfully!");
      const newBalance = await getBalance(smartContract?.address);
      setContractBalance(newBalance);
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error withdrawing all funds:", error);
    }
  };

  const handleTransferOwnership = async () => {
    try {
      const tx = await smartContract?.transferOwnership(newOwner);
      await tx.wait();
      toast.success("Ownership transferred successfully!");
      setNewOwner("");
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
      console.error("Error transferring ownership:", error);
    }
  };

  if (contractError) {
    return <div className="text-red-500">{contractError}</div>;
  }

  return (
    <div className="h-fit p-8 bg-gray-600">
      <Toaster />
      <Header />
      <h1 className="text-2xl font-bold mb-4">Roulette Contract Admin</h1>
      <p className="mb-4">Connected Address: {address}</p>
      <p className="mb-4">Contract Balance: {contractBalance} ETH</p>

      <Card className="mb-4">
        <CardHeader>Set House Wallet</CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="New House Wallet Address"
              value={newHouseWallet}
              onChange={(e) => setNewHouseWallet(e.target.value)}
            />
            <Button onClick={handleSetHouseWallet}>Set House Wallet</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Withdraw Funds</CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Amount to withdraw (ETH)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </div>
          <Button onClick={handleWithdrawAll}>Withdraw All</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Transfer Ownership</CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="New Owner Address"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <Button onClick={handleTransferOwnership}>Transfer Ownership</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Last 5 Games</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Amount Bet</TableHead>
                <TableHead>Guess</TableHead>
                <TableHead>Guess Type</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Jackpot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastGames.map((game, index) => (
                <TableRow key={index}>
                  <TableCell>{game.address}</TableCell>
                  <TableCell>{game.amountBet} ETH</TableCell>
                  <TableCell>{game.guess}</TableCell>
                  <TableCell>{game.guessType}</TableCell>
                  <TableCell>{game.winner ? "Yes" : "No"}</TableCell>
                  <TableCell>{game.payout} ETH</TableCell>
                  <TableCell>{game.ethInJackpot} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouletteAdmin;
