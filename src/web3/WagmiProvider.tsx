import { ReactNode } from 'react'
import { WagmiProvider as WagmiBaseProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'

// Create a client for TanStack Query
const queryClient = new QueryClient()

interface WagmiProviderProps {
  children: ReactNode
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiBaseProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiBaseProvider>
  )
}
