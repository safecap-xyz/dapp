import { useAccount, useBalance, useEnsName, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function useWallet() {
  const { address, isConnected, connector } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({
    address,
  })
  const chainId = useChainId()
  const isSepoliaNetwork = chainId === sepolia.id

  return {
    address,
    isConnected,
    connector,
    balance,
    ensName,
    chainId,
    isSepoliaNetwork,
    displayName: ensName || (address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''),
  }
}