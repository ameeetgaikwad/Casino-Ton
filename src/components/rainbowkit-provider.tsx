"use client";

import {
  RainbowKitProvider,
  Theme,
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import merge from "lodash.merge";
import * as React from "react";
import { Chain, WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
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
const bscTestnet: Chain = {
  name: "Binance Smart Chain Testnet",
  nativeCurrency: {
    name: "BNB",
    decimals: 18,
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: ["https://bsc-testnet-rpc.publicnode.com"] },
    default: { http: ["https://api.zan.top/node/v1/bsc/testnet/public"] },
  },
  id: 97,
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
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
          accentColor: "hsl(var(--shade))",
        },
        fonts: {
          body: "var(--font-sans)",
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
