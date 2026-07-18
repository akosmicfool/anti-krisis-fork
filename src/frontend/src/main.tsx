import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { arbitrum, base, celo, mainnet, optimism, polygon } from "viem/chains";
import { http, WagmiProvider } from "wagmi";
import App from "./App";
import "./index.css";
import type { AppKitNetwork } from "@reown/appkit/networks";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Apply dark class for dark industrial theme
document.documentElement.classList.add("dark");

// ─── AppKit / WalletConnect configuration ────────────────────────────────────
//
// @reown/appkit with WagmiAdapter for wagmi v3 compatibility.
// createAppKit is called ONCE at module level — never inside a component.
// All six chains are registered so wagmi can recognise any chain the wallet
// is on and useSwitchChain can switch to the correct chain for burns.
//
const projectId = "e44cc61a617e09ef20049ae7bdc1262c";

const chains = [mainnet, arbitrum, polygon, optimism, base, celo];

const transports = {
  [mainnet.id]: http(),
  [arbitrum.id]: http(),
  [polygon.id]: http(),
  [optimism.id]: http(),
  [base.id]: http(),
  [celo.id]: http(),
};

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: chains,
  transports,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create the AppKit modal — this registers the modal globally and makes
// modal.open() available via useAppKit() throughout the app.
export const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains as unknown as [AppKitNetwork, ...AppKitNetwork[]],
  defaultNetwork: base,
  metadata: {
    name: "Anti Krisis",
    description: "Mine $AKK. Power Anti Krisis.",
    url: "https://antikrisis.app",
    icons: ["/favicon.ico"],
  },
  features: {
    email: false,
    socials: false,
    analytics: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#00ff41",
    "--w3m-border-radius-master": "0px",
    "--w3m-font-family": "'VT323', monospace",
    "--w3m-z-index": 9999,
  },
});

// ─── Query client ────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>
  </WagmiProvider>,
);
