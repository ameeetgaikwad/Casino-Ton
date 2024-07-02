'use client';
import { ElementRef, useMemo, useRef, useState } from 'react';

export const useRouletteSound = () => {
	const ref = useRef<ElementRef<'audio'>>(null);

	return {
		AudioEl: () => (
			<audio ref={ref} playsInline>
				<source src="/sound/roulette.mp3" type="audio/mp3" />
				Your browser does not support the audio element.
			</audio>
		),

		audioRef: ref.current,
	};
};
