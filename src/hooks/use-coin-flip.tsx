'use client';
import { ElementRef, useMemo, useRef, useState } from 'react';

export const useCoinFip = () => {
	const ref = useRef<ElementRef<'audio'>>(null);

	return {
		AudioEl: () => (
			<audio ref={ref} playsInline>
				<source src="/sound/flip.wav" type="audio/wav" />
				Your browser does not support the audio element.
			</audio>
		),

		audioRef: ref.current,
	};
};
