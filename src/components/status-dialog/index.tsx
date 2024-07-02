'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { COIN } from './coin';
import { schema } from '@/lib/db';
import { Roulette } from './roulette';
import { useRouter } from 'next/navigation';

type GameType = (typeof schema.GAME_TYPE.enumValues)[number];
type Status = 'pending' | 'lose' | 'win';
export const statusDialogRef = createRef<any>();
export const statusDialogRefFunc = {
	updateStatus: (status: Status, value?: number, outcome?: string) => {
		statusDialogRef.current?.updateStatus(status, value, outcome);
	},
	toggleModal: (state: boolean, gameType: GameType) => {
		statusDialogRef.current?.toggleModal(state, gameType);
	},
};

export const StatusDialog = forwardRef((_, ref) => {
	const [gameType, setGameType] = useState<GameType>('COIN');
	const [value, setValue] = useState<number>();
	const [outcome, setOutcome] = useState<string>('');
	const [showModal, setShowModal] = useState(false);
	const [status, setStatus] = useState<Status>('pending');

	useImperativeHandle(ref, () => {
		return {
			updateStatus: (status: Status, value?: number, outcome?: string) => {
				setStatus(status);
				setValue(value);
				setOutcome(outcome ?? '');
			},

			toggleModal: (state: boolean, gameType: GameType) => {
				setShowModal(state);
				setGameType(gameType);
				setStatus('pending');
			},
		};
	});
	const Comp = gameType === 'COIN' ? COIN : Roulette;
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
					<Comp.Win value={value} outcome={outcome} />
				) : status === 'lose' ? (
					<Comp.Lose value={value} outcome={outcome} />
				) : (
					<Comp.Pending />
				)}
			</DialogContent>
		</Dialog>
	);
});
