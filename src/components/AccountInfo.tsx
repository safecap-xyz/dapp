import { useWallet } from '../web3/hooks/useWallet'

export function AccountInfo() {
  const { isConnected, displayName, balance, address, chainId, isSepoliaNetwork } = useWallet()

  if (!isConnected || !address) {
    return (
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center glass-panel shadow-neon">
        <p className="text-secondary-main font-primary">Connect your wallet to view account information</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-neutral-light/10 rounded-lg shadow-neon glass-panel border border-secondary-main/30">
      <h2 className="text-xl font-secondary font-bold mb-4 text-text-primary glow-text">Account Information</h2>
      <div className="cyber-line w-full my-3"></div>
      <div className="space-y-3 font-primary">
        <div className="flex justify-between items-center p-2 bg-primary-dark/30 rounded-md">
          <span className="font-medium text-text-primary">Address:</span>
          <span className="font-mono text-secondary-light">{displayName}</span>
        </div>
        {balance && (
          <div className="flex justify-between items-center p-2 bg-primary-dark/30 rounded-md">
            <span className="font-medium text-text-primary">Balance:</span>
            <span className="text-secondary-light font-mono">
              {balance.formatted} <span className="text-accent-main">{balance.symbol}</span>
            </span>
          </div>
        )}
        <div className="flex justify-between items-center p-2 bg-primary-dark/30 rounded-md">
          <span className="font-medium text-text-primary">Network:</span>
          <span className={isSepoliaNetwork ? "text-success-main" : "text-warning-main font-bold"}>
            {isSepoliaNetwork ? "Sepolia Testnet" : `Chain ID: ${chainId || 'Unknown'}`}
            {!isSepoliaNetwork && ' (Please switch to Sepolia)'}
          </span>
        </div>
      </div>
    </div>
  )
}