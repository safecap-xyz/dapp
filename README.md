# SafeCap - Futuristic Blockchain-Based Crowdfunding Platform

SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects. The platform features a modern, futuristic UI design and integrates with the Coinbase Developer Platform (CDP) AgentKit for enhanced blockchain interactions.

## Features

- **Futuristic UI**: Modern, cyberpunk-inspired design with neon accents and glass-morphism effects
- **Coinbase Developer Platform (CDP) Integration**: Enhanced blockchain interactions using AgentKit
- **Wallet Integration**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and other popular Ethereum wallets
- **Native Token Support**: Accept ETH donations for your project
- **ERC20 Support**: Accept various ERC20 tokens as donations
- **NFT Rewards**: Automatically mint unique digital collectibles for backers
- **Transparent Funding**: All donations and project progress tracked on the blockchain
- **All-or-Nothing Model**: Creators receive funds only if the goal is met
- **Toggle between UI Versions**: Switch between original and enhanced CDP-powered components

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
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Coinbase Developer Platform (CDP) AgentKit**: Enhanced blockchain interaction components
- **Wagmi**: React hooks for Ethereum, simplifying wallet connections and contract interactions
- **Viem**: TypeScript interface for Ethereum
- **React Query**: Data fetching and state management for blockchain data

## Wallet Connection & CDP AgentKit Setup

The dApp includes wallet connection capabilities using wagmi, viem, and the Coinbase Developer Platform (CDP) AgentKit. To use with your project:

1. **WalletConnect Project ID**: Replace the placeholder in `src/web3/config.ts` with your actual WalletConnect project ID:
   ```ts
   walletConnect({
     projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
   }),
   ```
   You can obtain a project ID by signing up at [WalletConnect Cloud](https://cloud.walletconnect.com/).

2. **CDP AgentKit API Key**: Replace the placeholder in `src/web3/OnchainKitProvider.tsx` with your actual CDP API key:
   ```ts
   <BaseOnchainKitProvider
     apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
     chain={defaultChain}
     config={{
       appearance: {
         name: "SafeCap",
         logo: `${window.location.origin}/logo.png`,
         mode: "dark",
         theme: "cyberpunk"
       }
     }}
   >
   ```
   You can obtain an API key by signing up at [Coinbase Developer Platform](https://docs.cdp.coinbase.com/).

3. **Environment Variables**: Create a `.env` file in the root directory with the following variables:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   VITE_ONCHAINKIT_API_KEY=your_cdp_api_key
   ```

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
│   ├── OnchainKitProvider.tsx    # CDP AgentKit provider
│   ├── utils.ts                  # Common utility functions
│   ├── hooks/
│   │   ├── useWallet.ts          # Wallet connection and state hook
│   │   └── useTokenBalance.ts    # Token balance hook
│   └── services/
│       └── TransactionService.ts # Contract interaction utilities
├── components/
│   ├── WalletConnect.tsx         # Original wallet connection UI component
│   ├── EnhancedWalletConnect.tsx # CDP-powered wallet connection component
│   ├── AccountInfo.tsx           # Account information display
│   ├── DeployContracts.tsx       # Original contract deployment component
│   ├── EnhancedDeployContracts.tsx # CDP-powered contract deployment component
│   ├── DonateCampaign.tsx        # Original donation component
│   └── EnhancedDonateCampaign.tsx # CDP-powered donation component
├── theme/
│   ├── theme.ts                  # Theme configuration
│   ├── global.css                # Global CSS styles
│   └── ThemeProvider.tsx         # Theme provider component
└── App.tsx                       # Main application with wallet integration
```

### Key Components

- **WagmiProvider**: Wraps the application with the necessary providers for wallet connectivity
- **OnchainKitProvider**: Provides CDP AgentKit context to the application
- **WalletConnect**: Original UI component for connecting and disconnecting wallets
- **EnhancedWalletConnect**: CDP-powered wallet connection component with improved UX
- **AccountInfo**: Displays information about the connected wallet account with futuristic styling
- **DeployContracts**: Original contract deployment component
- **EnhancedDeployContracts**: CDP-powered contract deployment component
- **DonateCampaign**: Original donation component
- **EnhancedDonateCampaign**: CDP-powered donation component
- **useWallet**: Custom hook that provides wallet state and connection details
- **useTokenBalance**: Hook for fetching token balances from the blockchain
- **TransactionService**: Utilities for sending transactions to smart contracts

## Futuristic Theme

The application features a modern, cyberpunk-inspired design with the following elements:

- **Color Palette**: Deep space blues, neon cyan, magenta, and green accents
- **Typography**: Futuristic fonts (Orbitron, Rajdhani, JetBrains Mono)
- **Visual Effects**: Neon glows, glass-morphism, subtle grid overlays
- **UI Components**: Custom styled buttons, cards, and form elements

### Theme Configuration

The theme is defined in `src/theme/theme.ts` and implemented through CSS variables in `src/theme/global.css`. The theme includes:

- **Colors**: Primary, secondary, accent, and UI state colors
- **Typography**: Font families, sizes, and weights
- **Spacing**: Consistent spacing scale
- **Borders**: Border radius and styling
- **Shadows**: Regular and neon glow effects

### CSS Utilities

Custom CSS utility classes are available for common futuristic UI elements:

- `.glass-panel`: Creates a translucent glass-like panel
- `.neon-border`: Adds a neon border glow effect
- `.glow-text`: Adds a text glow effect
- `.cyber-line`: Creates a horizontal divider with gradient effect

## CDP AgentKit Integration

The application integrates with the Coinbase Developer Platform (CDP) AgentKit to provide enhanced blockchain interactions:

### Wallet Components

The `EnhancedWalletConnect` component uses CDP AgentKit's wallet components for improved UX:

- Better wallet connection flow
- Enhanced wallet information display
- Improved error handling

### Transaction Components

The `EnhancedDonateCampaign` and `EnhancedDeployContracts` components use CDP AgentKit's transaction components for improved transaction handling:

- Streamlined transaction flow
- Better status updates and feedback
- Improved error handling and recovery

### UI Toggling

The application allows toggling between the original components and the CDP-powered enhanced components via a toggle button in the header, enabling comparison of the different implementations.

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables as described above
4. Start the development server with `pnpm run dev`
5. Connect your wallet and explore the application

## Build and Deployment

To build the application for production:

```bash
pnpm run build
```

The built application will be in the `dist` directory and can be deployed to any static hosting service.

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
