import { Fragment } from 'react';
import { CoinFace } from '../coin-face';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Roulette = {
	Pending: function () {
		return (
			<Fragment>
				<div className="coin-container">
					<img
						src="https://i.imgur.com/B0LS9RK.gif"
						alt="spinning wheel"
						className="coin-image animate-flip"
						style={{ width: '200px', height: '200px' }} // Adjust the width and height as needed
					/>
				</div>
				<h3 className="font-heading text-4xl">SPINNING</h3>
				<h3 className="text-primary font-heading text-4xl">GOOD LUCK DEGEN</h3>
			</Fragment>
		);
	},

	Lose: function ({ outcome, value }: { outcome: string; value?: number }) {
		const bg =
			Number(outcome) === 0
				? 'bg-[#00a307]'
				: Number(outcome) % 2 === 0
				? 'bg-[#1f2737]'
				: 'bg-[#c72f40]';
		return (
			<Fragment>
				<div
					className={cn(
						'p-8 aspect-square !border-2 !rounded-3xl',
						'button-style',
						bg
					)}
				>
					<span className=" !text-6xl">{outcome}</span>
				</div>
				<h3 className=" font-heading text-6xl">YOU LOST</h3>
				<span className="flex justify-center items-center gap-4">
					<CoinFace.Head width={50} height={50} />{' '}
					<h6 className="text-6xl">{value}</h6>
				</span>
				<h3 className=" font-heading  text-4xl">REMOVE FROM YOUR WALLET</h3>
				<h3 className="text-shade font-heading  text-4xl">PLACE YOUR BETS!</h3>
			</Fragment>
		);
	},

	Win: function ({ outcome, value }: { outcome: string; value?: number }) {
		const bg =
			Number(outcome) === 0
				? 'bg-[#00a307]'
				: Number(outcome) % 2 === 0
				? 'bg-[#1f2737]'
				: 'bg-[#c72f40]';
		return (
			<Fragment>
				<div
					className={cn(
						'p-8 aspect-square !border-2 !rounded-3xl',
						'button-style',
						bg
					)}
				>
					<span className=" !text-6xl">{outcome}</span>
				</div>
				<h3 className=" font-heading text-6xl">YOU WIN BABY</h3>
				<span className="flex justify-center items-center gap-4">
					<CoinFace.Head width={50} height={50} />{' '}
					<h6 className="text-6xl">{value}</h6>
				</span>
				<h3 className=" font-heading  text-4xl">ADDED TO YOUR WALLET</h3>
				<h3 className="text-shade font-heading  text-4xl">
					LUCKY NUMBERS HEY ;)
				</h3>
			</Fragment>
		);
	},
};
