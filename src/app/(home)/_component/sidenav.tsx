import { sideNavIcons } from '@/lib/sidenav-icon';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { Fragment } from 'react';

export const Sidenav = () => {
	return (
		<Fragment>
			<aside className=" hidden md:flex h-[744px]  rounded-2xl flex-col space-y-4 p-4 transform bg-shade transition-transform duration-150 ease-in md:translate-x-0 md:shadow-md">
				<div className=" w-32 h-32 flex justify-center items-center">
					<Image
						src="/svg/logo.svg"
						width={75}
						height={75}
						className="w-full h-full"
						alt="logo"
					/>
				</div>
				{sideNavIcons.map(({ icons }, idx) => (
					<div
						className="w-32 h-32 rounded-2xl overflow-hidden cursor-pointer"
						key={idx}
					>
						<Image
							src={icons}
							width={75}
							height={75}
							className={cn(
								idx === 0 ? 'bg-primary' : 'bg-background',
								'w-full h-full  p-4'
							)}
							alt="logo"
						/>
					</div>
				))}
			</aside>
		</Fragment>
	);
};
