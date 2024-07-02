import { statusDialogRefFunc } from '@/components/status-dialog';
import { saveTransactionData } from '@/lib/db/action';
import BigNumber from 'bignumber.js';
import { Contract } from 'ethers';
import { useEffect } from 'react';
import { useTransition } from './use-transition';

export const useCoinContractListener = (
	address: string,
	contract: Contract | undefined
) => {
	const [isPending, startTransaction] = useTransition();
	useEffect(() => {
		if (!contract) return;
		const cb = (
			playerAddress: string,
			_totalBetAmounts: BigNumber,
			guess: number,
			isWin: boolean,
			_totalPayout: BigNumber,
			_totalProfit: BigNumber,
			event: any
		) => {
			const totalPayout = Number(BigNumber(_totalPayout).toString()) / 1e18;
			const totalBetAmounts =
				Number(BigNumber(_totalBetAmounts).toString()) / 1e18;
			const totalProfit = Number(BigNumber(_totalProfit).toString()) / 1e18;
			isWin
				? statusDialogRefFunc.updateStatus('win', totalPayout)
				: statusDialogRefFunc.updateStatus('lose', totalBetAmounts);
			if (playerAddress === address) {
				startTransaction(async () => {
					await saveTransactionData(
						{
							isWin,
							player: address,
							transaction: event.transactionHash,
							wager: totalBetAmounts,
							outcome: guess == 0 ? 'HEAD' : 'TAIL',
							gameType: 'COIN',
							payout: totalPayout,
							profit: totalProfit,
						},
						'/coin'
					);
				});
			}
		};
		contract.addListener('DetailedGameResult', cb);
		return () => {
			contract.removeListener('DetailedGameResult', cb);
		};
	}, [contract, address]);

	return {
		isPending,
	};
};

export const useRouletteContractListener = (
	address: string,
	contract: Contract | undefined
) => {
	const [isPending, startTransition] = useTransition();
	useEffect(() => {
		if (!contract) return;
		const cb = (
			guess: number,
			playerAddress: string,
			_totalPayout: BigNumber,
			_totalBetAmounts: BigNumber,
			isWin: boolean,
			_totalProfit: BigNumber,
			event: any
		) => {
			const totalPayout = Number(BigNumber(_totalPayout).toString()) / 1e18;
			const totalBetAmounts =
				Number(BigNumber(_totalBetAmounts).toString()) / 1e18;
			const totalProfit = Number(BigNumber(_totalProfit).toString()) / 1e18;

			isWin
				? statusDialogRefFunc.updateStatus('win', totalPayout, guess.toString())
				: statusDialogRefFunc.updateStatus(
						'lose',
						totalBetAmounts,
						guess.toString()
				  );
			if (playerAddress === address) {
				startTransition(async () => {
					await saveTransactionData(
						{
							isWin,
							player: address,
							transaction: event.transactionHash,
							wager: totalBetAmounts,
							outcome: guess.toString(),
							gameType: 'ROULETTE',
							payout: totalPayout,
							profit: totalProfit,
						},
						'/roulette'
					);
				});
			}
		};
		contract.addListener('FinalResult', cb);
		return () => {
			contract.removeListener('FinalResult', cb);
		};
	}, [contract, address]);

	return {
		isPending,
	};
};
