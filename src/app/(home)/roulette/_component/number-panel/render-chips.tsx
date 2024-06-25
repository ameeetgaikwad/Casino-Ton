import { cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { ComponentProps, Fragment, useMemo } from 'react';
import { useRoulette } from '../store';
import { Pad } from '../store/pad';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';

interface RenderChipsProps extends ComponentProps<'div'> {
	chips: Array<Pad & { chipValue: string }>;
	x?: number;
	y?: number;
	item: Pad;
}
export const RenderChips = observer(function ({
	chips,
	x = 0,
	y = 0,
	item,
	className,
	...props
}: RenderChipsProps) {
	const store = useRoulette();
	const Chips = useMemo(() => {
		const current = chips.filter((chip) => chip.label === item.label);
		return current.map((chip, index) => {
			return (
				<img
					src={store.getImage(chip.chipValue)}
					alt=""
					style={{
						position: 'absolute',
						zIndex: index,
						top: x - index * 5,
						left: y,
						width: `25px`,
						height: `25px`,
						pointerEvents: 'none',
					}}
					key={'clicked' + index}
				/>
			);
		});
	}, [chips]);

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div
					{...props}
					onDoubleClick={(e) => e.preventDefault()}
					className={cn(
						'relative hover:number-hover select-none',
						'button-style',
						className
					)}
				>
					<span className="select-none">{!item['hideText'] && item.label}</span>
					{Chips}
				</div>
			</HoverCardTrigger>
			{/* <HoverCardContent className="w-20">
				<div className="flex justify-between space-x-4">
					{chips
						.reduce((p, c) => {
							const value = Number(c.chipValue);
							const idx = p.findIndex((pp) => pp.label === c.label);
							if (idx !== -1) {
								p[idx].count += value;
								return p;
							}
							return [...p, { label: c.chipValue, count: value }];
						}, [] as Array<{ label: string; count: number }>)
						.map((c, key) => (
							<Fragment key={key}>
								<img className="size-3" src={store.getImage(c.label)} />{' '}
								<span>
									X<span>{c.count}</span>
								</span>
							</Fragment>
						))}
				</div>
			</HoverCardContent> */}
		</HoverCard>
	);
});
