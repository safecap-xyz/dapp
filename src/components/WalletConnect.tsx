import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm text-white">
          Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
      >
        Connect Wallet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector })
                    setIsModalOpen(false)
                  }}
                  disabled={!connector.ready}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isPending && connector.uid === pendingConnector?.uid && ' (connecting)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
