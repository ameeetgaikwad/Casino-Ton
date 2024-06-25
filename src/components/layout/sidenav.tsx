'use client';
import { sideNavIcons } from '@/lib/sidenav-icon';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { Fragment } from 'react';

export const Sidenav = () => {
	const pathname = usePathname();
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
				{sideNavIcons.map((item, idx) => (
					<Box
						selected={pathname}
						href={item.href}
						icons={item.icons}
						key={idx}
					/>
				))}
			</aside>
		</Fragment>
	);
};

function Box({
	href,
	icons,
	selected,
}: {
	href: string | undefined;
	icons: string;
	selected: string | null;
}) {
	const Comp = (props: any) =>
		!href ? <div {...props} /> : <Link href={href} {...props} />;

	return (
		<Comp className="w-32 h-32 rounded-2xl overflow-hidden cursor-pointer">
			<Image
				src={icons}
				width={75}
				height={75}
				className={cn(
					href?.includes(selected ?? '') ? 'bg-primary' : 'bg-background',
					'w-full h-full  p-4'
				)}
				alt="logo"
			/>
		</Comp>
	);
}
