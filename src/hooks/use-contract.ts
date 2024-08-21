import * as contract from '@/../contract.json';
import { totalBetAmount } from '@/lib/db/action';
import { Contract, ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const { Game, deployedNetwork, networkName } = contract;

export const useContract = (gameType: keyof typeof Game) => {
  const { address, isConnected } = useAccount();
  const [contractData] = useState(Game[gameType]);
  const [error, setError] = useState<string>();
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | JsonRpcProvider>();
  const [smartContract, setSmartContract] = useState<Contract>();
  const provider_rpc_url = "https://bsc-testnet-rpc.publicnode.com";

  async function initializeProvider() {
    let _provider: JsonRpcProvider;
    let _signer: ethers.providers.JsonRpcSigner | JsonRpcProvider;

    // Always create a JsonRpcProvider
    _provider = new ethers.providers.JsonRpcProvider(provider_rpc_url, {
      chainId: 97,
      name: "Binance Smart Chain Testnet"
    });

    // Check if wallet is connected and set the signer accordingly
    if ((window as any).ethereum && isConnected) {
      const ethereum = (window as any).ethereum;
      await ethereum.enable();
      const walletProvider = new ethers.providers.Web3Provider(ethereum);
      console.log("walletProvider", walletProvider);

      _provider = walletProvider;
      _signer = walletProvider.getSigner();
    } else {
      _signer = _provider; // Use the JsonRpcProvider as the signer if wallet is not connected
    }

    setProvider(_provider);
    setSigner(_signer);

    await loadBlockchainData(_provider, _signer);
  }

  useEffect(() => {
    const init = async () => {

      await initializeProvider();
    }

    init()
  }, [provider_rpc_url, gameType, isConnected]);

  const getBalance = useCallback(async (targetAddress?: string) => {
    const addressToCheck = targetAddress || address || Game[gameType].contractAddress;

    if (addressToCheck && provider) {
      const _bal = await provider.getBalance(addressToCheck);
      return ethers.utils.formatEther(_bal);
    }

    return '0';
  }, [address, gameType, provider]);

  const loadBlockchainData = useCallback(async (provider: JsonRpcProvider, signer: ethers.providers.JsonRpcSigner | JsonRpcProvider) => {
    console.log("inside load blockchain", provider, signer)
    if (!provider || !contractData) return;
    const { abi, contractAddress } = contractData;
    const activeNetwork = await provider.getNetwork();

    if (activeNetwork.chainId !== deployedNetwork) {
      setError(`Please switch to ${networkName} in order to play`);
    }

    // Create contract instance with the correct signer
    setSmartContract(new ethers.Contract(contractAddress, abi, signer));
  }, [contractData]);

  const connectWallet = useCallback(async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const walletProvider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = walletProvider.getSigner();
        setSigner(_signer);

        // Update smart contract with signer for write operations
        if (smartContract) {
          setSmartContract(smartContract.connect(_signer));
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("Ethereum wallet not detected. Please install MetaMask or another wallet.");
    }
  }, [smartContract]);

  return {
    contract: contractData,
    error,
    getBalance,
    address,
    provider,
    smartContract,
    connectWallet,
    initializeProvider
  };
};

export const useGetTotalWager = (address: string, gameType: keyof typeof Game) => {
  const [totalWager, setTotalWager] = useState<string>();

  useEffect(() => {
    totalBetAmount(address as string, gameType)
      .then(wager => setTotalWager(wager[0]?.value ?? '0'));
  }, [address, gameType]);

  return { totalWager };
};
