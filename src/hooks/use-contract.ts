
import * as contract from '@/../contract.json';
import { totalBetAmount } from '@/lib/db/action';
import { Contract, ethers } from 'ethers';
import { Web3Provider, JsonRpcProvider } from 'ethers/providers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
const { Game, deployedNetwork, networkName } = contract

export const useContract = (gameType: keyof typeof Game) => {
  const { address } = useAccount()
  const [contract] = useState(Game[gameType])
  const [error, setError] = useState<string>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>()
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [smartContract, setSmartContract] = useState<Contract>()
  const provider_rpc_url = "https://bsc-testnet-rpc.publicnode.com"
  // const provider_rpc_url = process.env.NEXT_PUBLIC_BSC_RPC_URL


  useEffect(() => {
    async function loadWeb3() {

      let _provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider;

      const ethereum = (window as any).ethereum;

      // if (ethereum != undefined) {
      //   console.log("inside etherum");

      //   await ethereum.enable();
      //   _provider = new ethers.providers.Web3Provider(ethereum);
      if (provider_rpc_url) {

        _provider = new ethers.providers.JsonRpcProvider(provider_rpc_url, { chainId: 97, name: " Binance Smart Chain Testnet" });
      } else {

        _provider = new ethers.providers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com", { chainId: 97, name: "bsctestnet" });
      }

      setProvider(_provider);
      setSigner(_provider.getSigner())

      if (_provider) {
        await loadBlockchainData(_provider);
      }
    }
    loadWeb3()
  }, [provider_rpc_url, gameType, address])

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


  const loadBlockchainData = useCallback(async (provider: JsonRpcProvider) => {

    if (!provider || !contract) return;
    const { abi, contractAddress } = contract
    const activeNetwork = await provider.getNetwork();
    if (activeNetwork.chainId !== deployedNetwork) {
      setError(`Please switch to ${networkName} in order to play`);
    }
    // const signer = await provider.getSigner()
    // console.log("lulu", signer);
    setSmartContract(new ethers.Contract(contractAddress, abi, provider!));

  }, [contract, provider])



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




