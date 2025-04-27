import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Detect if MetaMask is available
const metaMaskInstalled = typeof window !== 'undefined' &&
  typeof window.ethereum !== 'undefined' &&
  (window.ethereum.isMetaMask ||
   (window.ethereum.providers &&
    window.ethereum.providers.some((p: any) => p.isMetaMask)))

console.log('MetaMask installed detection:', metaMaskInstalled)

// Configure chains & providers
export const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    // Include injected connector first for broader compatibility
    injected({
      shimDisconnect: true,
    }),
    // Include walletConnect for mobile support
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: 'SafeCap',
        description: 'SafeCap Web Application',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`]
      }
    }),
    // Add Coinbase Wallet
    coinbaseWallet({
      appName: 'SafeCap',
    }),
    // Note: MetaMask connector is handled directly in the WalletConnect component
    // to avoid issues with duplicate connectors
  ],
})