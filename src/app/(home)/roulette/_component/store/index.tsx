'use client';
import { enableStaticRendering } from 'mobx-react-lite';
import React, { createContext, useContext } from 'react';
import { Store } from './Store';
enableStaticRendering(typeof window === 'undefined');
export const RouletteContext = createContext(new Store());

export const RouletteProvider = ({ children }) => {
	const [store] = React.useState(new Store());

	return (
		<RouletteContext.Provider value={store}>
			{children}
		</RouletteContext.Provider>
	);
};

export const useRoulette = () => {
	const context = useContext(RouletteContext);
	if (!context) {
		throw new Error('useRoulette must be used inside RouletteProvider.');
	}
	return context;
};
