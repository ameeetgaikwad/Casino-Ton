"use client";
import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import HowItWorks from "./_component/HowItWorks";
import { Header } from "./_component/header";
import { useContract } from "@/hooks/use-contract";
import { MyLotteries } from "@/components/my-lotteries";
import { Button } from "@/components/ui/button";
import { tickets } from "@/lib/db/schema/tickets";
import { Switch } from "@/components/ui/switch"

type Raffle = {
  lotteryId: number;
  amount: number;
  ticketsSold: number;
  totalTickets: number;
  isSoldOut: boolean;
  prizePool: number;
};

type MyLotteriesProps = {
  lotteryId: number;
  ticketsPurchased: number;
  ticketPrice: number;
  status: number;
  remainingTickets: number;
  prizePool: number;
  winner: string;
};

const TicketProgressBar = ({ ticketsSold, totalTickets }) => {
  const progress = (ticketsSold / totalTickets) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-md text-gray-400">
          Tickets sold: {ticketsSold}
        </span>
        <span className="text-md text-gray-400">Total: {totalTickets}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-5">
        <div
          className="bg-yellow-400 h-5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-md text-gray-400 mt-2">
        {totalTickets - ticketsSold} tickets left
      </p>
    </div>
  );
};

const RaffleGame = () => {

  const [myLotteries, setMyLotteries] = useState<MyLotteriesProps[] | []>([]);
  const [trendingRaffles, setTrendingRaffles] = useState<Raffle[]>([]);
  const [selectedLotteryId, setSelectedLotteryId] = useState<number>();

  const { smartContract, error, address } = useContract("LOTTERY");

  const [megaRaffle, setMegaRaffle] = useState<Raffle>();

  const changeMegaRaffle = (raffle: Raffle) => {
    setSelectedLotteryId(raffle.lotteryId);
    setMegaRaffle(raffle);
  };

  const initialLoadd = async () => {
    try {
      if (error) {
        throw new Error(error);
      }
      if (!address) {
        throw new Error(`Connect Wallet`);
      }
      if (!smartContract) {
        throw new Error(`Contract not initialized`);
      }

      let tx = await smartContract?.getActiveLotteries();
      let activeLotteries: any[] = [];

      let bestLottery : Raffle = {} as Raffle;


      for (let i = 0; i < tx.length; i++) {
        

        const thisLottery = {
          lotteryId: tx[i][0],
          amount: parseInt(tx[i][2]._hex, 16),
          ticketsSold: parseInt(tx[i][4]._hex, 16),
          totalTickets: parseInt(tx[i][3]._hex, 16),
          isSoldOut: tx[i][6] != 1 ? true : false,
          prizePool: parseInt(tx[i][1]._hex, 16),
        };

        activeLotteries.push(thisLottery);

        if (!bestLottery.prizePool || (bestLottery.totalTickets - bestLottery.ticketsSold > thisLottery.totalTickets - thisLottery.ticketsSold)) {
          bestLottery = thisLottery;
        }
      }
      console.log("LALLA", bestLottery);
      setTrendingRaffles(activeLotteries);
      setMegaRaffle(bestLottery);
      setSelectedLotteryId(bestLottery.lotteryId);

      tx = await smartContract?.getPlayerLotteries(address);
      let myLotteriesData: any[] = [];

      for (let i = 0; i < tx.length; i++) {
        myLotteriesData.push({
          lotteryId: parseInt(tx[i][0]._hex, 16),
          ticketsPurchased: parseInt(tx[i][1]._hex, 16),
          ticketPrice: parseInt(tx[i][2]._hex, 16),
          status: tx[i][3],
          remainingTickets: parseInt(tx[i][4]._hex, 16),
          prizePool: parseInt(tx[i][5]._hex, 16),
          winner: tx[i][6],
        });
      }

      setMyLotteries(myLotteriesData);


    } catch (err: any) {
      console.log(err);
    }
  };

  const onBuyTicket = async (lotteryId) => {
    try {
      if (error) {
        throw new Error(error);
      }
      if (!address) {
        throw new Error(`Connect Wallet`);
      }
      if (!smartContract) {
        throw new Error(`Contract not initialized`);
      }
      const tx = await smartContract?.buyTicket();
      console.log(tx);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (smartContract) {
      console.log(smartContract);
    }

    try {
      initialLoadd();
    } catch (err: any) {
      console.log(err);

    }
  }, [smartContract]);

  const buyTrendingRaffleTicket = (index) => {
    setTrendingRaffles((prev) =>
      prev.map((raffle, i) =>
        i === index && raffle.ticketsSold < raffle.totalTickets
          ? { ...raffle, ticketsSold: raffle.ticketsSold + 1 }
          : raffle
      )
    );
    // TODO: Implement API call to purchase ticket
  };

  return (
    <div className=" justify-center align-middle items-center  text-white h-full p-4 sm:p-6 lg:p-8 relative">
      <Header />
      {/* Decorative stars */}
      <div className="absolute top-4 left-4 text-yellow-400 text-2xl">✦</div>
      <div className="absolute bottom-4 right-4 text-yellow-400 text-4xl">
        ✦
      </div>

      <div className="flex flex-col">

        <div className="w-full h-full mt-10 items-center justify-center align-middle mx-auto flex flex-col md:flex-row md:items-start md:space-x-8">
          {megaRaffle ? 
            <div className="md:w-[500px] bg-shade p-4 rounded-md p-6 max-w-[500px]">
              <h2 className="text-5xl sm:text-5xl font-bold mb-4 text-yellow-400">
                ${megaRaffle.prizePool}
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                Lottery is drawn once all the {megaRaffle.totalTickets} tickets have been sold
              </p>

              <TicketProgressBar
                ticketsSold={megaRaffle.ticketsSold}
                totalTickets={megaRaffle.totalTickets}
              />
              <Button
                
                className="font-heading my-6 text-xl w-full"
              >
                Buy Ticket
              </Button>

              <p className="text-sm text-gray-400">Ticket prize: {megaRaffle.amount}</p>
            </div>
          : <> </> }
          {/* Trending Raffles Section - Right Side */}
          <div className="md:w-7/10 bg-shade p-5 rounded-md">
            <h3 className="text-3xl font-bold mb-2 flex items-center">
              <Flame className="text-orange-500 mr-2 h-8 w-8" /> Trending Lottery
              Draws
            </h3>
            <p className="mb-4 text-lg text-gray-400">
              Lottery is drawn once target slots have been sold
            </p>
            <div className="grid grid-cols-2 gap-4">
              {trendingRaffles.map((raffle, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-8 ${
                    raffle.amount === 0 ? "opacity-50" : ""
                  } border border-yellow-400`}
                >
                  <div className="flex justify-between">
                  <p className="text-lg font-bold mb-1">
                    ${raffle.amount.toLocaleString()}
                    <br />
                   
                  </p>
                  <Switch
                      checked={raffle.lotteryId === megaRaffle?.lotteryId}
                      onCheckedChange={() => changeMegaRaffle(raffle)}
                    />
                  </div>
                  <p className="text-xl font-bold text-gray-400 mb-2">
                    <h4>Prize pool: ${raffle.prizePool}</h4>
                  </p>
                  <p className="text-s text-gray-400 mb-2">
                    Tickets: {raffle.ticketsSold} of {raffle.totalTickets}
                  </p>
                  
                  {/* {raffle && (
                    <button
                      onClick={() => buyTrendingRaffleTicket(index)}
                      className={`py-1 px-2 rounded text-xs font-bold ${
                        raffle.isSoldOut
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                      }`}
                      disabled={raffle.isSoldOut}
                    >
                      {raffle.isSoldOut ? "Sold Out" : "Buy Now"}
                    </button>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <MyLotteries records={myLotteries} />
        <HowItWorks />
      </div>
    </div>
  );
};

export default RaffleGame;
