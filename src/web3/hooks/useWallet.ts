import { useAccount, useBalance, useEnsName } from 'wagmi'

export function useWallet() {
  const { address, isConnected, connector } = useAccount()
  const { data: balance } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({
    address,
  })

  return {
    address,
    isConnected,
    connector,
    balance,
    ensName,
    displayName: ensName || (address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''),
  }
}
