import { getAllTransaction, getEthFiatRate, totalBetAmount } from './action';
import { BetForm } from './_component/bet-form';
import { Header } from './_component/header';
import { TransactionHistory } from './_component/transaction-history';
import { Fragment } from 'react';
export default async function Home() {
	const transactionHistory = await getAllTransaction();
	const ethRate = await getEthFiatRate();

	return (
		<Fragment>
			<main className="hidden  main -ml-48 md:flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
				<Header
					lastTenOutcome={transactionHistory.map((o) => ({
						outcome: o.outcome,
					}))}
				/>
				<h1 className="text-6xl font-heading text-primary mt-4 mb-4">
					COINFLIP
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full ">
					<BetForm fiatRate={Number(ethRate['USD'] ?? 200)} />
				</div>
				{transactionHistory.length > 0 && (
					<TransactionHistory records={transactionHistory} />
				)}
			</main>
			<h1 className="md:hidden block">Mobile View Not Supported</h1>
		</Fragment>
	);
}
