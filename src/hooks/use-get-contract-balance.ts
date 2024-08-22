import React, { useEffect, useState } from 'react'
import { useContract } from './use-contract';

export const useGetContractBalance = (contractAddress: string, contract: "ROULETTE" | "COIN" | "LOTTERY" = "ROULETTE") => {
  const { getBalance } = useContract(contract)
  const [contractBalance, setContractBalance] = useState<string>();
  useEffect(() => {
    const fetchContractBalance = async () => {
      try {
        const balance = await getBalance(contractAddress);
        setContractBalance(balance);
      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    };

    // Initial fetch when the component mounts
    fetchContractBalance();

    // Periodically fetch and update the contract balance (every 3 seconds in this example)
    const intervalId = setInterval(fetchContractBalance, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [getBalance, contractAddress]);

  return {
    contractBalance
  }
}
