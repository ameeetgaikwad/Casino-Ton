import Image from 'next/image';
import React, { ComponentProps } from 'react';

interface CoinFaceProps extends Partial<ComponentProps<typeof Image>> {}

export const CoinFace = () => null;
CoinFace.Head = ({ height, width, ...props }: CoinFaceProps) => {
	return (
		<Image
			{...props}
			src="/svg/head.svg"
			alt="head"
			width={width ?? 35}
			height={height ?? 35}
		/>
	);
};

CoinFace.Tail = ({ height, width, ...props }: CoinFaceProps) => {
	return (
		<Image
			{...props}
			src="/svg/tail.svg"
			alt="tail"
			width={width ?? 35}
			height={height ?? 35}
		/>
	);
};
