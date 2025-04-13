import { useWallet } from '../web3/hooks/useWallet'

export function AccountInfo() {
  const { isConnected, displayName, balance, address } = useWallet()

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
      </div>
    </div>
  )
}
