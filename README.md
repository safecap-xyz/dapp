# SafeCap - Blockchain-Based Crowdfunding Platform

SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.

## Features

- **Wallet Integration**: Connect with MetaMask, WalletConnect, and other popular Ethereum wallets
- **Native Token Support**: Accept ETH donations for your project
- **ERC20 Support**: Accept various ERC20 tokens as donations
- **NFT Rewards**: Automatically mint unique digital collectibles for backers
- **Transparent Funding**: All donations and project progress tracked on the blockchain
- **All-or-Nothing Model**: Creators receive funds only if the goal is met

## Testnet Deployment

The platform is configured to deploy contracts on the Sepolia testnet for development and testing.

- **Network Configuration**: The app prioritizes Sepolia testnet over mainnet
- **Network Switcher**: Built-in component to help users switch to Sepolia
- **Deployment Process**: Multi-step deployment of Factory, NFT, and Sample Campaign contracts
- **Visual Indicators**: Clear UI elements indicating Sepolia testnet usage

To deploy on the Sepolia testnet:
1. Connect your wallet
2. Switch to Sepolia testnet if not already connected
3. Navigate to the "Deploy" tab
4. Click "Deploy Contracts" and approve the transactions

## Technologies

- **React + TypeScript + Vite**: Modern front-end stack
- **Wagmi**: React hooks for Ethereum, simplifying wallet connections and contract interactions
- **Viem**: TypeScript interface for Ethereum
- **React Query**: Data fetching and state management for blockchain data

## Wallet Connection Setup

The dApp includes wallet connection capabilities using wagmi and viem. To use with your project:

1. **WalletConnect Project ID**: Replace the placeholder in `src/web3/config.ts` with your actual WalletConnect project ID:
   ```ts
   walletConnect({
     projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
   }),
   ```
   You can obtain a project ID by signing up at [WalletConnect Cloud](https://cloud.walletconnect.com/).

2. **Supported Networks**: By default, the dApp supports Ethereum Mainnet and Sepolia testnet. To add more networks, modify the chains array in `src/web3/config.ts`:
   ```ts
   chains: [mainnet, sepolia, arbitrum, optimism],
   ```

3. **Custom Contract Interactions**: Use the provided `useTransaction` hook from `src/web3/services/TransactionService.ts` to interact with your smart contracts:
   ```ts
   const { sendContractTransaction, isLoading, isSuccess, receipt } = useTransaction();
   
   // Example usage
   const handleDonation = async () => {
     await sendContractTransaction({
       address: '0xYourContractAddress',
       abi: yourContractABI,
       functionName: 'donate',
       args: [],
       value: parseEther('0.1')
     });
   };
   ```

## Project Structure

### Web3 Integration
```
src/
├── web3/
│   ├── config.ts                 # Wagmi configuration
│   ├── WagmiProvider.tsx         # Provider wrapper for the app
│   ├── utils.ts                  # Common utility functions
│   ├── hooks/
│   │   ├── useWallet.ts          # Wallet connection and state hook
│   │   └── useTokenBalance.ts    # Token balance hook
│   └── services/
│       └── TransactionService.ts # Contract interaction utilities
├── components/
│   ├── WalletConnect.tsx         # Wallet connection UI component
│   └── AccountInfo.tsx           # Account information display
└── App.tsx                       # Main application with wallet integration
```

### Key Components

- **WagmiProvider**: Wraps the application with the necessary providers for wallet connectivity
- **WalletConnect**: UI component for connecting and disconnecting wallets
- **AccountInfo**: Displays information about the connected wallet account
- **useWallet**: Custom hook that provides wallet state and connection details
- **useTokenBalance**: Hook for fetching token balances from the blockchain
- **TransactionService**: Utilities for sending transactions to smart contracts

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
