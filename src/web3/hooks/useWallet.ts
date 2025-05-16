import { useAccount, useBalance, useEnsName, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export function useWallet() {
  const { address, isConnected, connector } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({
    address,
  })
  const chainId = useChainId()
  const isBaseSepoliaNetwork = chainId === baseSepolia.id

  return {
    address,
    isConnected,
    connector,
    balance,
    ensName,
    chainId,
    isBaseSepoliaNetwork,
    displayName: ensName || (address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''),
  }
}