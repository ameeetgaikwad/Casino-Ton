import { CoinFace } from '@/components/coin-face';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Coin = 'head' | 'tail';
interface CoinSelectionProps {
	onSelection: (value: Coin) => void;
	selected: Coin;
}

export const CoinSelection = ({
	onSelection,
	selected,
}: CoinSelectionProps) => {
	return (
		<Card className="bg-shade py-1 md:px-2 ">
			<CardHeader>
				<h3>Make Your Selection</h3>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 justify-between">
					<div className="col-span-1 flex flex-col gap-8">
						<div
							className="flex flex-col justify-center items-center gap-4 cursor-pointer"
							onClick={() => onSelection('head')}
						>
							<CoinFace.Head width={160} height={160} />
							<h3 className="font-heading">Head</h3>
						</div>
						<div
							className="flex flex-col justify-center items-center gap-4 cursor-pointer"
							onClick={() => onSelection('tail')}
						>
							<CoinFace.Tail width={160} height={160} />
							<h3 className="font-heading">Tails</h3>
						</div>
					</div>
					<Card className="col-span-2 h-full max-h-[490px]  aspect-[3/4] p-[29px] m-auto bg-background/70">
						<div className="flex flex-col justify-center items-center gap-4">
							{selected === 'head' ? (
								<CoinFace.Head width={300} height={300} />
							) : (
								<CoinFace.Tail width={300} height={300} />
							)}

							<div className="text-center">
								<h3>My Selection is...</h3>
								<h3 className="font-heading text-4xl uppercase">{selected}</h3>
							</div>
						</div>
					</Card>
				</div>
			</CardContent>
		</Card>
	);
};
