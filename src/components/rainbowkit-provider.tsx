'use client';

import {
	RainbowKitProvider,
	Theme,
	connectorsForWallets,
	darkTheme,
	getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
	argentWallet,
	ledgerWallet,
	trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import merge from 'lodash.merge';
import * as React from 'react';
import { bscTestnet } from 'viem/chains';
import { Chain, WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// @ts-ignore
const bsc: Chain = {
	name: 'Binance Smart Chain Mainnet',
	nativeCurrency: {
		name: 'BNB',
		decimals: 2,
		symbol: 'BNB',
	},
	rpcUrls: {
		public: { http: ['https://bsc-rpc.publicnode.com'] },
		default: { http: ['https://bsc-rpc.publicnode.com'] },
	},
	id: 56,
	testnet: true,
};
const { chains, publicClient, webSocketPublicClient } = configureChains(
	[bscTestnet, bsc],
	[publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
	appName: 'RainbowKit demo',
	projectId,
	chains,
});

const demoAppInfo = {
	appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: 'Other',
		wallets: [
			argentWallet({ projectId, chains }),
			trustWallet({ projectId, chains }),
			ledgerWallet({ projectId, chains }),
		],
	},
]);

const wagmiConfig = createConfig({
	autoConnect: false,
	connectors,
	publicClient,
	webSocketPublicClient,
});
export function RainbowProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	const theme = React.useMemo(
		() =>
			merge(darkTheme(), {
				colors: {
					accentColor: 'hsl(var(--shade))',
				},
				fonts: {
					body: 'var(--font-sans)',
				},
			} as Theme),
		[]
	);

	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains} appInfo={demoAppInfo} theme={theme}>
				{mounted && children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
