"use client";
import React, { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import HowItWorks from "./_component/HowItWorks";
import { Header } from "./_component/header";
import { Button } from "@/components/ui/button";



const TicketProgressBar = ({ ticketsSold, totalTickets }) => {
  const progress = (ticketsSold / totalTickets) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-md text-gray-400">Tickets sold: {ticketsSold}</span>
        <span className="text-md text-gray-400">Total: {totalTickets}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-5">
        <div
          className="bg-yellow-400 h-5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-md text-gray-400 mt-2">{totalTickets - ticketsSold} tickets left</p>
    </div>
  );
};

const RaffleGame = () => {
  const [mainRaffleAmount, setMainRaffleAmount] = useState(260);
  const [ticketsSold, setTicketsSold] = useState(2);
  const [totalTickets, setTotalTickets] = useState(100);

  const [trendingRaffles, setTrendingRaffles] = useState([
    { amount: 78.09, ticketsSold: 3, totalTickets: 3, isSoldOut: true },
    { amount: 455, ticketsSold: 0, totalTickets: 500 },
    { amount: 715, ticketsSold: 0, totalTickets: 500 },
    { amount: 13000, ticketsSold: 0, totalTickets: 5000 },
    { amount: 0, ticketsSold: 0, totalTickets: 0 },
    { amount: 0, ticketsSold: 0, totalTickets: 0 },
  ]);

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

            <TicketProgressBar ticketsSold={ticketsSold} totalTickets={totalTickets} />
            <Button onClick={buyMainRaffleTicket} className="font-heading my-6 text-xl w-full">
              Buy Ticket
            </Button>
            {/* <button
              onClick={buyMainRaffleTicket}
              className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-md text-sm hover:bg-yellow-400 transition-colors mb-4"
            >
              Buy ticket now
            </button> */}
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
                  className={`  rounded-lg p-8 ${raffle.amount === 0 ? "opacity-50" : ""} ${
                    raffle.amount === 455 ? "border border-yellow-400" : "border border-yellow-400"
                  }`}
                >
                  <p className="text-lg font-bold mb-1">${raffle.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    Tickets: {raffle.ticketsSold} of {raffle.totalTickets}
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
