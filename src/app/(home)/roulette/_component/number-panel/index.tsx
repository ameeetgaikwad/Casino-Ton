'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { ElementRef, Fragment, useRef } from 'react';
import { useRoulette } from '../store';
import { RenderChips } from './render-chips';
import './style.css';

export const NumberPanel = observer(() => {
	const ref = useRef<ElementRef<'div'>>(null);
	const {
		pad,
		pad2,
		chipItems,
		appendChipItems,
		undoChipItems,
		clearAllChipItems,
	} = useRoulette();
	return (
		<Fragment>
			<div
				className="relative grid grid-cols-13 font-medium gap-1 sm:gap-2 "
				ref={ref}
			>
				<RenderChips
					chips={chipItems}
					item={pad[0]}
					style={{ backgroundColor: pad[0].color }}
					x={60}
					onClick={() => {
						appendChipItems(pad[0]);
					}}
				/>

				<div className="grid grid-cols-12 col-span-12 gap-1 sm:gap-2">
					{pad.slice(1).map((item, index) => {
						return (
							<RenderChips
								key={index}
								className={cn(
									'aspect-square',
									Number(item.value) % 2 === 0 ? 'bg-[#1f2737]' : 'bg-[#c72f40]'
								)}
								chips={chipItems}
								item={item}
								onClick={() => {
									appendChipItems(item);
								}}
							/>
						);
					})}
				</div>
				<div></div>
				<div className="grid grid-cols-13 col-span-12 gap-1 sm:gap-2">
					<div className="col-span-2"></div>
					{pad2.map((item, index) => {
						return (
							<RenderChips
								key={index}
								style={{ backgroundColor: item.color }}
								className={cn('aspect-[2.21/1] text-[8px] col-span-2')}
								chips={chipItems}
								item={item}
								x={0}
								y={30}
								onClick={() => {
									appendChipItems(item);
								}}
							/>
						);
					})}
					<div className="col-span-12 gap-x-2 flex items-center justify-center">
						<Button
							variant="ghost"
							className="text-white p-0 text-[10px] sm:text-xs  col-span-2 w-[100px] h-5 sm:h-8 md:h-10 rounded-[0.5rem] border border-solid border-[#f6f6f6] flex justify-center items-center"
							onClick={undoChipItems}
						>
							Undo
						</Button>
						<Button
							variant="ghost"
							className="text-white p-0 text-[10px] sm:text-xs  col-span-2 w-[100px] h-5 sm:h-8 md:h-10 rounded-[0.5rem] border border-solid border-[#f6f6f6] flex justify-center items-center"
							onClick={clearAllChipItems}
						>
							Clear
						</Button>
					</div>
				</div>
			</div>
		</Fragment>
	);
});
