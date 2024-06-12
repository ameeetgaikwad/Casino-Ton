'use client';
import { useContract } from '@/hooks/use-contract';
import { ConnectButton as _ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { Button } from './ui/button';
import { useEffect, useMemo, useState } from 'react';

// ... (previous imports)

export const ConnectButton = () => {
	const [balance, setBalance] = useState<string>('Loading...');
	const [contractBalance, setContractBalance] = useState<string>('Loading...');
	const { getBalance } = useContract();

	const contractAddress = '0xAACFC4515093Ca7a40fF6F9EcddA22af4c6e616c';
  
	const fetchAndUpdateBalance = async () => {
	  try {
		const newBalance = await getBalance();
		setBalance(String(Math.floor(Number(newBalance) * 1000) / 1000));
	  } catch (error) {
		console.error("Error fetching balance:", error);
	  }
	};

	const fetchAndUpdateContractBalance = async () => {
		try {
		  const newBalance = await getBalance(contractAddress);
		  setContractBalance(String(Math.floor(Number(newBalance) * 1000) / 1000));
		} catch (error) {
		  console.error("Error fetching contract balance:", error);
		}
	  };
  
	// Initial fetch when the component mounts
	useEffect(() => {
	  fetchAndUpdateBalance();
	}, [getBalance]);
  
	// Periodically fetch and update the balance (every 10 seconds in this example)
	useEffect(() => {
	  const intervalId = setInterval(fetchAndUpdateBalance, 3000);
  
	  // Cleanup the interval on component unmount
	  return () => clearInterval(intervalId);
	}, [getBalance]);


	// Initial fetch when the component mounts
	useEffect(() => {
		fetchAndUpdateContractBalance();
	  }, [getBalance, contractAddress]);
	
	  // Periodically fetch and update the contract balance (every 10 seconds in this example)
	  useEffect(() => {
		const intervalId = setInterval(fetchAndUpdateContractBalance, 10000);
	
		// Cleanup the interval on component unmount
		return () => clearInterval(intervalId);
	  }, [getBalance, contractAddress]);
  
	return (
	  <_ConnectButton.Custom>
		{({
		  account,
		  chain,
		  openAccountModal,
		  openChainModal,
		  openConnectModal,
		  authenticationStatus,
		  mounted,
		}) => {
		  const ready = mounted && authenticationStatus !== 'loading';
		  const connected =
			ready &&
			account &&
			chain &&
			(!authenticationStatus || authenticationStatus === 'authenticated');
		  
		  return (
			<div
			  {...(!ready && {
				'aria-hidden': true,
				style: {
				  opacity: 0,
				  pointerEvents: 'none',
				  userSelect: 'none',
				},
			  })}
			>
			  {(() => {
				if (!connected) {
				  return (
					<Button
					  onClick={openConnectModal}
					  className="font-heading text-xl"
					  type="button"
					>
					  CONNECT WALLET
					</Button>
				  );
				}
				if (chain.unsupported) {
				  return (
					<Button
					  className="font-heading text-xl"
					  variant="destructive"
					  onClick={openChainModal}
					  type="button"
					>
					  Wrong network
					</Button>
				  );
				}
				return (
				  <div className="flex justify-center items-center gap-4">
					<div className="flex gap-3 justify-center items-center">
					  <h3 className="font-heading">HOUSE BALANCE</h3>
					  <Image
						src="/svg/head.svg"
						alt="head"
						width={30}
						height={30}
					  />
					  <span className="text-primary">{contractBalance}</span>
					</div>
					<div className="flex gap-3 justify-center items-center">
					  <h3 className="font-heading">WALLET</h3>
					  <Image
						src="/svg/head.svg"
						alt="head"
						width={30}
						height={30}
					  />
					  <span className="text-primary">{balance}</span>
					</div>
					<span className="text-xl">{account.displayName}</span>
					<Button
					  className="font-heading text-xl"
					  onClick={openAccountModal}
					>
					  DISCONNECT
					</Button>
				  </div>
				);
			  })()}
			</div>
		  );
		}}
	  </_ConnectButton.Custom>
	);
  };
  
