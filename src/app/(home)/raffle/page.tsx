"use client";
import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import HowItWorks from "./_component/HowItWorks";
import { Header } from "./_component/header";
import { useContract } from "@/hooks/use-contract";

type Raffle = {
  amount: number;
  ticketsSold: number;
  totalTickets: number;
  isSoldOut: boolean;
  prizePool: number;
};

const RaffleGame = () => {
  const [mainRaffleAmount, setMainRaffleAmount] = useState(260);
  const [ticketsSold, setTicketsSold] = useState(2);
  const [totalTickets, setTotalTickets] = useState(100);
  
  const { smartContract, error, address } = useContract('LOTTERY');

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
      const tx = await smartContract?.getActiveLotteries();
      let activeLotteries : any[] = [];

      for (let i = 0; i < tx.length; i++) {
        activeLotteries.push({
          amount: parseInt(tx[i][2]._hex, 16),
          ticketsSold: parseInt(tx[i][4]._hex, 16),
          totalTickets: parseInt(tx[i][3]._hex, 16),
          isSoldOut: tx[i][6] != 1 ? true : false,
          prizePool: parseInt(tx[i][1]._hex, 16),
        });
      }
      

      setTrendingRaffles(activeLotteries);
    
    } catch (err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (smartContract) {
      console.log(smartContract)
    }

    // setLoading(true);
		try {
      initialLoadd();
    } catch (err: any) {
      console.log(err)
      // toast.error(err.message);
    }
  }, [smartContract])

  const [trendingRaffles, setTrendingRaffles] = useState<Raffle[]>([]);

  const buyMainRaffleTicket = () => {
    if (ticketsSold < totalTickets) {
      setTicketsSold((prev) => prev + 1);
      // TODO: Implement API call to purchase ticket
    }
  };

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

  useEffect(() => {
    if (ticketsSold === totalTickets) {
      // TODO: Implement raffle drawing logic
      console.log("Main raffle ready to be drawn!");
    }
  }, [ticketsSold, totalTickets]);

  return (
    <div className=" justify-center align-middle items-center  text-white h-full p-4 sm:p-6 lg:p-8 relative">
      <Header />
      {/* Decorative stars */}
      <div className="absolute top-4 left-4 text-yellow-400 text-2xl">✦</div>
      <div className="absolute bottom-4 right-4 text-yellow-400 text-4xl">✦</div>

      <div className="flex flex-col">
        {/* Main Raffle Section - Left Side */}
        <div className="w-full  h-full mt-10 items-center justify-center align-middle mx-auto flex flex-col md:flex-row md:items-start md:space-x-8">
          <div className="md:w-1/3 bg-shade p-4 rounded-md">
            <h2 className="text-6xl sm:text-7xl font-bold mb-4 text-yellow-400">${mainRaffleAmount}</h2>
            <p className="mb-4 text-sm text-gray-400">Raffle is drawn once {totalTickets} tickets have been sold</p>
            <div className="bg-gray-800 border border-yellow-400 rounded-lg p-8 mb-6 flex flex-col ">
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {ticketsSold}
                </span>
                <span className="text-yellow-400 font-bold">/</span>
                <span className="text-yellow-400 font-bold">{totalTickets.toString().padStart(3, "0")}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {ticketsSold} tickets sold of {totalTickets}
              </p>
            </div>
            <button
              onClick={buyMainRaffleTicket}
              className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-md text-sm hover:bg-yellow-400 transition-colors mb-4"
            >
              Buy ticket now
            </button>
            <p className="text-sm text-gray-400">Ticket prize: $1</p>
          </div>

          {/* Trending Raffles Section - Right Side */}
          <div className="md:w-2/3 bg-shade p-4 rounded-md">
            <h3 className="text-3xl font-bold mb-2 flex items-center">
              <Flame className="text-orange-500 mr-2 h-8 w-8" /> Trending Raffle draws
            </h3>
            <p className="mb-4 text-lg text-gray-400">Raffle is drawn once target slots have been sold</p>
            <div className="grid grid-cols-2 gap-4">
              {trendingRaffles.map((raffle, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-8 ${raffle.amount === 0 ? "opacity-50" : ""} border border-yellow-400`}
                >
                  <p className="text-lg font-bold mb-1">${raffle.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    Tickets: {raffle.ticketsSold} of {raffle.totalTickets}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Prize pool: {raffle.prizePool}
                  </p>
                  {raffle.amount > 0 && (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <HowItWorks />
      </div>
    </div>
  );
};

export default RaffleGame;
