import { ReactNode } from 'react';
import { OnchainKitProvider as BaseOnchainKitProvider } from '@coinbase/onchainkit';
import { sepolia } from 'wagmi/chains';

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  // Default to sepolia for development
  const defaultChain = sepolia;

  return (
    <BaseOnchainKitProvider
      apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
      chain={defaultChain}
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
