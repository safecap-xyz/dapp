import { useWallet } from '../web3/hooks/useWallet'

export function AccountInfo() {
  const { isConnected, displayName, balance, address, chainId, isSepoliaNetwork } = useWallet()

  if (!isConnected || !address) {
    return (
      <div className="p-4 bg-secondary-main/10 rounded-lg text-center">
        <p className="text-secondary-dark font-primary">Connect your wallet to view account information</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-neutral-light rounded-lg shadow-md">
      <h2 className="text-xl font-secondary font-bold mb-4 text-primary-dark">Account Information</h2>
      <div className="space-y-2 font-primary">
        <div className="flex justify-between">
          <span className="font-medium text-text-primary">Address:</span>
          <span className="font-mono text-text-secondary">{displayName}</span>
        </div>
        {balance && (
          <div className="flex justify-between">
            <span className="font-medium text-text-primary">Balance:</span>
            <span className="text-text-secondary">
              {balance.formatted} {balance.symbol}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium text-text-primary">Network:</span>
          <span className={isSepoliaNetwork ? "text-success-main" : "text-warning-main"}>
            {isSepoliaNetwork ? "Sepolia Testnet" : `Chain ID: ${chainId || 'Unknown'}`}
            {!isSepoliaNetwork && ' (Please switch to Sepolia)'}
          </span>
        </div>
      </div>
    </div>
  )
}