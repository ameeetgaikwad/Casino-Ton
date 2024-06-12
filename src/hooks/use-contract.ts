
import * as contract from '@/../contract.json';
import { statusDialogRefFunc } from '@/app/(home)/_component/status-dialog';
import { saveTransactionData, totalBetAmount } from '@/app/(home)/action';
import { Contract, ethers } from 'ethers';
import { Web3Provider } from 'ethers/providers';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useTransition } from './use-transition';
const { abi, contractAddress, deployedNetwork, networkName } = contract
export const useContract = () => {
  const { address } = useAccount()
  const [error, setError] = useState<string>()
  const [shortContractAddress, setShortContractAddress] = useState<string>()
  const [contract, setContract] = useState<Contract>()
  const [provider, setProvider] = useState<Web3Provider>()

  useEffect(() => {
    async function loadWeb3() {
      const ethereum = (window as any).ethereum
      var provider: Web3Provider | null = null
      if (ethereum) {
        await ethereum.enable();
        provider = new ethers.providers.Web3Provider(ethereum)

        setProvider(provider)
      }
      if (provider) {
        loadBlockchainData(provider);
      }
    }
    loadWeb3()
  }, [])
  const getBalance = useCallback(async (targetAddress?: string) => {
    const addressToCheck = targetAddress || address || contractAddress; // Use user address if available, otherwise, use the contract address

    if (addressToCheck) {
      const _bal = await provider?.getBalance(addressToCheck) ?? '0';
      return ethers.utils.formatEther(_bal);
    }

    return '0' as string;
  }, [address, contractAddress, provider]);

  const getTotalWager = useCallback(async () => {
    return totalBetAmount(address as string)
  }, [address, provider])

  const loadBlockchainData = useCallback(async (provider: Web3Provider) => {
    if (!provider) return;
    setShortContractAddress(contractAddress.slice(0, 4) + "..." + contractAddress.slice(-4));
    const activeNetwork = await provider.getNetwork();
    if (activeNetwork.chainId !== deployedNetwork) {
      setError(`Please switch to ${networkName} in order to play`);
    }
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    setContract(contract);

  }, [])



  return {
    contract,
    shortContractAddress,
    error,
    getBalance,
    address,
    provider,
    getTotalWager
  }
}



export const useContractListener = (address: string, contract: Contract | undefined, form: UseFormReturn<any>) => {
  const [isPending, startTransaction] = useTransition();
  useEffect(() => {
    if (!contract) return;
    const cb = (side: number, event: any) => {
      const betAmount = form.getValues('wager');
      const userValue = form.getValues('coinSide') === 'head' ? 0 : 1;
      const isWin = side === userValue;
      const payout = (
        isWin ? betAmount * 1.881 : betAmount - betAmount * 2
      );
      isWin
        ? statusDialogRefFunc.updateStatus('win', payout)
        : statusDialogRefFunc.updateStatus('lose', payout);
      startTransaction(async () => {
        await saveTransactionData({
          isWin,
          player: address,
          transaction: event.transactionHash,
          wager: betAmount.toString(),
          outcome: side == 0 ? 'HEAD' : 'TAIL',
          payout,
          profit: payout,
        });
      });
    };
    contract.addListener('GameResult', cb);
    return () => {
      contract.removeListener('GameResult', cb);
    };
  }, [contract, form]);


  return {
    isPending
  }
}