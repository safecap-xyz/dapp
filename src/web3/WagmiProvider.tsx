import { ReactNode } from 'react'
import { WagmiProvider as WagmiBaseProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'
import { OnchainKitProvider } from './OnchainKitProvider'

// Create a client for TanStack Query
const queryClient = new QueryClient()

interface WagmiProviderProps {
  children: ReactNode
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiBaseProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiBaseProvider>
  )
}
