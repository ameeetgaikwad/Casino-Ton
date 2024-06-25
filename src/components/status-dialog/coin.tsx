import { Fragment } from 'react';
import { CoinFace } from '../coin-face';

export const COIN = {
	Pending: function () {
		return (
			<Fragment>
				<div className="coin-container">
					<img
						src="https://i.imgur.com/tJoX6og.gif"
						alt="flipping coin"
						className="coin-image animate-flip"
						style={{ width: '200px', height: '200px' }} // Adjust the width and height as needed
					/>
				</div>
				<h3 className="font-heading text-4xl">FLIPPING</h3>
				<h3 className="text-primary font-heading text-4xl">GOOD LUCK DEGEN</h3>
			</Fragment>
		);
	},

	Lose: function ({ value }: { value?: number }) {
		return (
			<Fragment>
				<h3 className=" font-heading text-6xl">YOU LOST</h3>
				<span className="flex justify-center items-center gap-4">
					<CoinFace.Head width={60} height={60} />
					<h6 className="text-4xl">{value}</h6>
				</span>
				<h3 className=" font-heading  text-4xl">REMOVED FROM YOUR WALLET</h3>
				<h3 className="text-shade font-heading  text-4xl">
					50/50 CHANCE - UNLUCKY
				</h3>
			</Fragment>
		);
	},

	Win: function ({ value }: { value?: number }) {
		return (
			<Fragment>
				<h3 className=" font-heading text-6xl">YOU WIN BABY</h3>
				<span className="flex justify-center items-center gap-4">
					<CoinFace.Head width={60} height={60} />
					<h6 className="text-4xl">{value}</h6>
				</span>
				<h3 className=" font-heading  text-4xl">ADDED TO YOUR WALLET</h3>
				<h3 className="text-shade font-heading  text-4xl">WELL DONE BALLER</h3>
			</Fragment>
		);
	},
};
