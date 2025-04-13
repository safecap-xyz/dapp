import { useWallet } from '../web3/hooks/useWallet'
import { sepolia } from 'wagmi/chains'

export function AccountInfo() {
  const { isConnected, displayName, balance, address, chainId, isSepoliaNetwork } = useWallet()

  if (!isConnected || !address) {
    return (
      <div className="p-4 bg-blue-100 rounded-lg text-center">
        <p className="text-blue-800">Connect your wallet to view account information</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Account Information</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Address:</span>
          <span className="font-mono">{displayName}</span>
        </div>
        {balance && (
          <div className="flex justify-between">
            <span className="font-medium">Balance:</span>
            <span>
              {balance.formatted} {balance.symbol}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">Network:</span>
          <span className={isSepoliaNetwork ? "text-green-600" : "text-orange-600"}>
            {isSepoliaNetwork ? "Sepolia Testnet" : `Chain ID: ${chainId || 'Unknown'}`}
            {!isSepoliaNetwork && ' (Please switch to Sepolia)'}
          </span>
        </div>
      </div>
    </div>
  )
}