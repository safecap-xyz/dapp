import { ReactNode } from 'react';
import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  // Define a compatible chain object for Sepolia
  const sepoliaChain = {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.infura.io/v3/'],
      },
      public: {
        http: ['https://sepolia.infura.io/v3/'],
      },
    },
  };

  return (
    <BaseOnchainKitProvider
      apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY || ''}
      chain={sepoliaChain}
      config={{
        appearance: {
          name: "SafeCap",
          // Use a placeholder logo URL - replace with your actual logo
          logo: `${window.location.origin}/logo.png`,
          mode: "dark", // Use dark mode to match our futuristic theme
          theme: "cyberpunk" // Use the cyberpunk theme to match our futuristic design
        }
      }}
    >
      {children}
    </BaseOnchainKitProvider>
  );
}
