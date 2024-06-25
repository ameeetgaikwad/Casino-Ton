'use client';
import { useContract } from '@/hooks/use-contract';
import { useGetContractBalance } from '@/hooks/use-get-contract-balance';
import { ConnectButton as _ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

// ... (previous imports)

export const ConnectButton = () => {
	const pathname = usePathname();
	const { address, contract } = useContract(
		pathname.includes('coin') ? 'COIN' : 'ROULETTE'
	);
	const { contractBalance } = useGetContractBalance(contract.contractAddress);
	const { contractBalance: balance } = useGetContractBalance(address as string);

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
										<span className="text-primary">
											{Math.floor(Number(contractBalance) * 100) / 100}
										</span>
									</div>
									<div className="flex gap-3 justify-center items-center">
										<h3 className="font-heading">WALLET</h3>
										<Image
											src="/svg/head.svg"
											alt="head"
											width={30}
											height={30}
										/>
										<span className="text-primary">{Math.floor(Number(balance) * 100) / 100}</span>
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
