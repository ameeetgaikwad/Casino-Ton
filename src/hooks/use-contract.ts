import * as contract from '@/../contract.json';
// import { totalBetAmount } from '@/db/action';
import { Contract, ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { bsc } from 'viem/chains';
import { useAccount } from 'wagmi';

const { Game, deployedNetwork, networkName } = contract;

export const useContract = (gameType: keyof typeof Game) => {
  const { address, isConnected } = useAccount();
  // const [contractData] = useState(Game[gameType]);
  const [error, setError] = useState<string>();
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | JsonRpcProvider>();
  const [smartContract, setSmartContract] = useState<Contract>();
  // const provider_rpc_url = "https://bsc-testnet-rpc.publicnode.com";
  const contractData = useMemo(() => Game[gameType], [gameType]);

  const provider_rpc_url = process.env.NEXT_PUBLIC_BSC_RPC_URL;

  const memoizedContract = useMemo(() => {
    if (!provider || !signer || !contractData) return null;

    const { abi, contractAddress } = contractData;
    return new ethers.Contract(contractAddress, abi, signer);
  }, [provider, contractData]);

  const initializeProvider = useCallback(async () => {
    let _provider: JsonRpcProvider;
    let _signer: ethers.providers.JsonRpcSigner | JsonRpcProvider;

    _provider = new ethers.providers.JsonRpcProvider(provider_rpc_url, {
      chainId: 56,
      name: "Binance Smart Chain"
    });

    if ((window as any).ethereum && isConnected) {
      const ethereum = (window as any).ethereum;
      await ethereum.enable();
      const walletProvider = new ethers.providers.Web3Provider(ethereum);
      _provider = walletProvider;
      _signer = walletProvider.getSigner();
    } else {
      _signer = _provider;
    }

    setProvider(_provider);
    setSigner(_signer);
  }, [provider_rpc_url, isConnected]);


  const loadBlockchainData = useCallback(async (provider: JsonRpcProvider) => {
    if (!provider || !contractData) return;

    const activeNetwork = await provider.getNetwork();

    if (activeNetwork.chainId !== deployedNetwork) {
      setError(`Please switch to ${networkName} in order to play`);
    }
  }, [contractData]);

  useEffect(() => {
    const init = async () => {
      console.log("initialised provider");
      await initializeProvider();
      if (provider) {
        await loadBlockchainData(provider);
      }
    };

    init();
  }, []);

  const getBalance = useCallback(async (targetAddress?: string) => {
    const addressToCheck = targetAddress || address || contractData.contractAddress;

    if (addressToCheck && provider) {
      const _bal = await provider.getBalance(addressToCheck);
      return ethers.utils.formatEther(_bal);
    }

    return '0';
  }, [address, provider, contractData]);

  // const loadBlockchainData = useCallback(async (provider: JsonRpcProvider, signer: ethers.providers.JsonRpcSigner | JsonRpcProvider) => {
  //   // console.log("inside load blockchain", provider, signer)
  //   if (!provider || !contractData) return;
  //   const { abi, contractAddress } = contractData;
  //   const activeNetwork = await provider.getNetwork();

  //   if (activeNetwork.chainId !== deployedNetwork) {
  //     setError(`Please switch to ${networkName} in order to play`);
  //   }

  //   // Create contract instance with the correct signer
  //   setSmartContract(new ethers.Contract(contractAddress, abi, signer));
  // }, [contractData]);

  const connectWallet = useCallback(async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const walletProvider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = walletProvider.getSigner();
        setSigner(_signer);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("Ethereum wallet not detected. Please install MetaMask or another wallet.");
    }
  }, []);

  return {
    contract: contractData,
    error,
    getBalance,
    address,
    provider,
    smartContract: memoizedContract,
    connectWallet,
    initializeProvider
  };
};

export const useGetTotalWager = (address: string, gameType: keyof typeof Game) => {
  const [totalWager, setTotalWager] = useState<string>();

  useEffect(() => {
    // totalBetAmount(address as string, gameType)
    //   .then(wager => setTotalWager(wager[0]?.value ?? '0'));
  }, [address, gameType]);

  return { totalWager };
};
