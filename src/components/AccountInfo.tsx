import { useWallet } from '../web3/hooks/useWallet'

export function AccountInfo() {
  const { isConnected, displayName, balance, address, chainId, isSepoliaNetwork } = useWallet()

  if (!isConnected || !address) {
    return (
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center border border-secondary-main/30">
        <p className="text-secondary-light font-primary">Connect your wallet to view account information</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium font-primary text-text-primary">Address:</span>
          <span className="font-mono text-secondary-light truncate max-w-[200px]">{displayName}</span>
        </div>
        {balance && (
          <div className="flex justify-between items-center">
            <span className="font-medium font-primary text-text-primary">Balance:</span>
            <span className="font-mono text-secondary-light">
              {balance.formatted} <span className="text-accent-light">{balance.symbol}</span>
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-medium font-primary text-text-primary">Network:</span>
          <span className={isSepoliaNetwork ? "text-success-main" : "text-warning-main font-primary"}>
            {isSepoliaNetwork ? "Sepolia Testnet" : `Chain ID: ${chainId || 'Unknown'}`}
            {!isSepoliaNetwork && ' (Please switch to Sepolia)'}
          </span>
        </div>
      </div>
    </div>
  )
}