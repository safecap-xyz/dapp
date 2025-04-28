import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Detect if MetaMask is available
const metaMaskInstalled = typeof window !== 'undefined' &&
  typeof window.ethereum !== 'undefined' &&
  (window.ethereum.isMetaMask ||
   (window.ethereum.providers &&
    window.ethereum.providers.some((p: { isMetaMask?: boolean }) => p.isMetaMask)))

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
    // Include walletConnect for mobile support with improved error handling
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      // Use metadata to provide app information
      metadata: {
        name: 'SafeCap',
        description: 'SafeCap Web Application',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`]
      },
      // Add connection handling options
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999'
        },
        explorerRecommendedWalletIds: [],
        enableExplorer: true
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