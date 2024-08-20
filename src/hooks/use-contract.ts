
import * as contract from '@/../contract.json';
import { totalBetAmount } from '@/lib/db/action';
import { Contract, ethers } from 'ethers';
import { Web3Provider } from 'ethers/providers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
const { Game, deployedNetwork, networkName } = contract

export const useContract = (gameType: keyof typeof Game) => {
  const { address } = useAccount()
  const [contract] = useState(Game[gameType])
  const [error, setError] = useState<string>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>()
  const [smartContract, setSmartContract] = useState<Contract>()

  useEffect(() => {
    async function loadWeb3() {
      const ethereum = (window as any).ethereum
      let provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null = null
      if (ethereum) {
        await ethereum.enable();
        provider = new ethers.providers.Web3Provider(ethereum)
        console.log("PROVIDER", provider);
      } else {
        // Fallback provider (Infura/Alchemy)
        provider = new ethers.providers.JsonRpcProvider(`${process.env.BSC_RPC_URL}`); // Use the appropriate URL for your network
        console.log("PROVIDER", provider);
      }
      console.log("PROVIDER", provider);

      setProvider(provider)
      if (provider) {
        loadBlockchainData(provider as Web3Provider);
      }
    }
    loadWeb3()
  }, [])

  // useEffect(() => {
  //   async function loadWeb3() {
  //     const bscTestnet = (window as any).bscTestnet
  //     var provider: Web3Provider | null = null
  //     if (bscTestnet) {
  //       await bscTestnet.enable();
  //       provider = new ethers.providers.Web3Provider(bscTestnet)

  //       setProvider(provider)
  //     }
  //     if (provider) {
  //       console.log("Inside provider");
  //       loadBlockchainData(provider);
  //     }
  //   }
  //   loadWeb3()
  // }, [])

  const getBalance = useCallback(async (targetAddress?: string) => {
    const addressToCheck = targetAddress || address || Game[gameType].contractAddress; // Use user address if available, otherwise, use the contract address

    if (addressToCheck) {


      const _bal = await provider?.getBalance(addressToCheck) ?? '0';
      return ethers.utils.formatEther(_bal);
    }

    return '0' as string;
  }, [address, gameType, provider]);


  const loadBlockchainData = useCallback(async (provider: Web3Provider) => {
    if (!provider || !contract) return;
    const { abi, contractAddress } = contract
    const activeNetwork = await provider.getNetwork();
    if (activeNetwork.chainId !== deployedNetwork) {
      setError(`Please switch to ${networkName} in order to play`);
    }
    console.log("lulu", contractAddress);
    setSmartContract(new ethers.Contract(contractAddress, abi, provider.getSigner()));

  }, [contract])



  return {
    contract,
    error,
    getBalance,
    address,
    provider,
    smartContract
  }
}



export const useGetTotalWager = (address: string, gameType: keyof typeof Game) => {
  const [totalWager, setTotalWager] = useState<string>()
  useEffect(() => {
    totalBetAmount(address as string, gameType)
      .then(wager => setTotalWager(wager[0].value ?? '0'))

  }, [address, gameType])


  return { totalWager }
}




