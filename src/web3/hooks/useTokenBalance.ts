import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

/**
 * Hook to fetch the balance of a token for the connected account
 * @param tokenAddress Optional ERC20 token address (if undefined, fetches native token balance)
 * @returns Object containing the balance information
 */
export function useTokenBalance(tokenAddress?: `0x${string}`) {
  const { address, isConnected } = useAccount()
  const [formattedBalance, setFormattedBalance] = useState<string>('0')
  
  const { data: balanceData, isLoading, refetch } = useBalance({
    address,
    token: tokenAddress
  })

  useEffect(() => {
    if (balanceData) {
      setFormattedBalance(balanceData.formatted)
    } else {
      setFormattedBalance('0')
    }
  }, [balanceData])

  return {
    balance: balanceData?.value ?? BigInt(0),
    formattedBalance,
    symbol: balanceData?.symbol ?? 'ETH',
    decimals: balanceData?.decimals ?? 18,
    isLoading,
    refetch,
  }
}
