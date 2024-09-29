"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "@/hooks/use-contract";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTonAddress } from "@tonconnect/ui-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
// import { useAccount } from "wagmi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "../header";
import { useRouter } from "next/navigation";
import {
  requestHouseBalance,
  requestResolveGame,
} from "@/services/helpers/flipHelper";
import { globalConfig } from "@/config/global";

type GameEntry = {
  address: string;
  amountBet: string;
  guess: number;
  winner: boolean;
  totalPayout: string;
  totalProfit: string;
};

const FlipAdmin = () => {
  const {
    smartContract,
    error: contractError,
    getBalance,
  } = useContract("COIN");
  const address = useTonAddress();
  const [contractBalance, setContractBalance] = useState("0");
  const [newHouseWallet, setNewHouseWallet] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [lastGames, setLastGames] = useState<GameEntry[]>([]);
  const [houseBalance, setHouseBalance] = useState(0);
  const [gameId, setGameId] = useState("");
  const router = useRouter();

  // const checkOwner = async () => {
  //   if (smartContract && address) {
  //     console.log("insid here");

  //     try {
  //       const owner = await smartContract.getOwnerWallet();
  //       console.log("FLIP OWNER", owner);

  //       if (owner.toLowerCase() !== address.toLowerCase()) {
  //         router.push("/");
  //       }
  //     } catch (error) {
  //       console.error("Error checking owner:", error);
  //     }
  //   }
  // };

  //TODO: UNcomment this
  // useEffect(() => {
  //   checkOwner();
  // }, [address, smartContract]);
  //TODO: UNcomment this

  // useEffect(() => {
  //   const fetchContractData = async () => {
  //     if (smartContract) {
  //       try {
  //         const balance = await getBalance(smartContract.address);
  //         setContractBalance(balance);

  //         const count = await smartContract.getGameCount();
  //         setGameCount(count.toNumber());

  //         const games: GameEntry[] = [];
  //         for (let i = Math.max(0, count - 5); i < count; i++) {
  //           let game = await smartContract.getGameEntry(i);
  //           games.push({
  //             address: game.addr,
  //             amountBet: ethers.utils.formatEther(game.amountBet),
  //             guess: game.guess,
  //             winner: game.winner,
  //             totalPayout: ethers.utils.formatEther(game.totalPayout),
  //             totalProfit: ethers.utils.formatEther(game.totalProfit),
  //           });
  //         }
  //         setLastGames(games);
  //       } catch (error) {
  //         console.error("Error fetching contract data:", error);
  //       }
  //     }
  //   };

  //   fetchContractData();
  // }, [smartContract]);

  // const handleSetHouseWallet = async () => {
  //   try {
  //     const tx = await smartContract?.setHouseWallet(newHouseWallet);
  //     await tx.wait();
  //     toast.success("House wallet updated successfully!");
  //     setNewHouseWallet("");
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error setting house wallet:", error);
  //   }
  // };

  // const handleWithdraw = async () => {
  //   try {
  //     const amount = ethers.utils.parseEther(withdrawAmount);
  //     const tx = await smartContract?.withdraw(amount);
  //     await tx.wait();
  //     toast.success(`${withdrawAmount} ETH withdrawn successfully!`);
  //     setWithdrawAmount("");
  //     const newBalance = await getBalance(smartContract?.address);
  //     setContractBalance(newBalance);
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error withdrawing funds:", error);
  //   }
  // };

  // const handleWithdrawAll = async () => {
  //   try {
  //     const tx = await smartContract?.withdrawAll();
  //     await tx.wait();
  //     toast.success("All funds withdrawn successfully!");
  //     const newBalance = await getBalance(smartContract?.address);
  //     setContractBalance(newBalance);
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error withdrawing all funds:", error);
  //   }
  // };

  // const handleTransferOwnership = async () => {
  //   try {
  //     const tx = await smartContract?.transferOwnership(newOwner);
  //     await tx.wait();
  //     toast.success("Ownership transferred successfully!");
  //     setNewOwner("");
  //   } catch (error) {
  //     toast.error((error as any)?.data?.message || "An error occurred");
  //     console.error("Error transferring ownership:", error);
  //   }
  // };

  if (contractError) {
    return <div className="text-red-500">{contractError}</div>;
  }

  useEffect(() => {
    const fetchHouseBalance = async () => {
      const balance = await requestHouseBalance();
      setHouseBalance(balance);
    };

    fetchHouseBalance();
  }, []);

  // const handleResolveGame = async () => {
  //   try {
  //     const response = await requestResolveGame(gameId);
  //     console.log(response, "response");
  //   } catch (error) {
  //     console.error("Error resolving game:", error);
  //   }
  // };

  return (
    <div className="p-8 h-full bg-gray-600">
      <Toaster />
      <Header />
      <h1 className="text-2xl font-bold mb-4">Flip Contract Admin</h1>
      <p className="mb-4">Connected Address: {globalConfig.houseAddress}</p>
      <p className="mb-4">Contract Balance: {houseBalance} USDC</p>

      {/* <Card className="mb-4">
        <CardHeader>Resolve Game</CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
            <Button onClick={handleResolveGame}>Resolve Game</Button>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card className="mb-4">
        <CardHeader>Withdraw Funds</CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Amount to withdraw (ETH)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button>Withdraw</Button>
          </div>
          <Button>Withdraw All</Button>
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
            <Button>Transfer Ownership</Button>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card className="mb-4">
        <CardHeader>Last 5 Games</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Amount Bet</TableHead>
                <TableHead>Guess</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Total Payout</TableHead>
                <TableHead>Total Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastGames.map((game, index) => (
                <TableRow key={index}>
                  <TableCell>{game.address}</TableCell>
                  <TableCell>{game.amountBet} USDC</TableCell>
                  <TableCell>{game.guess === 0 ? "Heads" : "Tails"}</TableCell>
                  <TableCell>{game.winner ? "Yes" : "No"}</TableCell>
                  <TableCell>{game.totalPayout} USDC</TableCell>
                  <TableCell>{game.totalProfit} USDC</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default FlipAdmin;
