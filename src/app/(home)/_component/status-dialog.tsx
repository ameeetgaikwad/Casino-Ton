'use client';
import { CoinFace } from '@/components/coin-face';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
	Fragment,
	createRef,
	forwardRef,
	useImperativeHandle,
	useState,
} from 'react';

type Status = 'pending' | 'lose' | 'win';
export const statusDialogRef = createRef<any>();
export const statusDialogRefFunc = {
	updateStatus: (status: Status, value?: number) => {
		statusDialogRef.current?.updateStatus(status, value);
	},
	toggleModal: (state: boolean) => {
		statusDialogRef.current?.toggleModal(state);
	},
};

export const StatusDialog = forwardRef((_, ref) => {
	const [value, setValue] = useState<number>();
	const [showModal, setShowModal] = useState(false);
	const [status, setStatus] = useState<Status>('pending');

	useImperativeHandle(ref, () => {
		return {
			updateStatus: (status: Status, value?: number) => {
				setStatus(status);
				setValue(value);
			},

			toggleModal: (state: boolean) => {
				setShowModal(state);
				setStatus('pending');
			},
		};
	});
	return (
		<Dialog open={showModal} onOpenChange={() => setShowModal(!showModal)}>
			<DialogContent
				overlayClassName={
					status === 'win'
						? 'bg-green-700'
						: status === 'lose'
						? 'bg-red-700'
						: ''
				}
				className="sm:max-w-[700px] bg-transparent  border-none flex flex-col shadow-none justify-center items-center "
			>
				{status === 'win' ? (
					<Win value={value} />
				) : status === 'lose' ? (
					<Lose value={value} />
				) : (
					<Pending />
				)}
			</DialogContent>
		</Dialog>
	);
});

function Pending() {
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
  }

function Lose({ value }: { value?: number }) {
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
}

function Win({ value }: { value?: number }) {
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
}
