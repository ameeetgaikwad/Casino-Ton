"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bsc } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import merge from "lodash.merge";
import * as React from "react";

// @ts-ignore
// const vitruveo: Chain = {
//   name: "vitruveo",
//   nativeCurrency: {
//     name: "VTRU",
//     decimals: 2,
//     symbol: "VTRU",
//   },
//   rpcUrls: {
//     public: { http: ["https://rpc.vitruveo.xyz/"] },
//     default: { http: ["https://rpc.vitruveo.xyz/"] },
//   },
//   id: 1490,
//   testnet: true,
// };

// @ts-ignore
// const bscTestnet: Chain = {
//   name: "Binance Smart Chain Testnet",
//   nativeCurrency: {
//     name: "BNB",
//     decimals: 18,
//     symbol: "BNB",
//   },
//   rpcUrls: {
//     public: { http: ["https://bsc-testnet-rpc.publicnode.com"] },
//     default: { http: ["https://api.zan.top/node/v1/bsc/testnet/public"] },
//   },
//   id: 97,
//   testnet: true,
// };

const bscMainnet: Chain = {
  name: "Binance Smart Chain",
  nativeCurrency: {
    name: "BNB",
    decimals: 18,
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: ["https://bnb.rpc.subquery.network/public"] },
    default: { http: ["https://bnb.rpc.subquery.network/public"] },
  },
  id: 56,
  testnet: false,
};

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

// const { wallets } = getDefaultWallets({
//   appName: "RainbowKit demo",
//   projectId,
//   chains,
// });

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: "Recommended",
//       wallets: [metaMaskWallet, argentWallet, ledgerWallet, trustWallet],
//     },
//   ],
//   {
//     appName: "RainbowKit demo",
//     projectId: "YOUR_PROJECT_ID",
//   }
// );

const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: projectId,
  chains: [bsc],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [coinbaseWallet, walletConnectWallet],
    },
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   webSocketPublicClient,
// });
const queryClient = new QueryClient();

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  // const [mounted, setMounted] = React.useState(false);
  // React.useEffect(() => setMounted(true), []);
  // const theme = React.useMemo(
  //   () =>
  //     merge(darkTheme(), {
  //       colors: {
  //         accentColor: "hsl(var(--shade))",
  //       },
  //       fonts: {
  //         body: "var(--font-sans)",
  //       },
  //     } as Theme),
  //   []
  // );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
