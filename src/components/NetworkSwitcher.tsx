import { useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const isCorrectNetwork = chainId === sepolia.id

  const handleSwitchNetwork = async () => {
    try {
      setIsLoading(true)
      await switchChain({ chainId: sepolia.id })
    } catch (error) {
      console.error('Error switching chain:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center p-2 bg-green-100 text-green-800 rounded-md mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Connected to Sepolia Testnet</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-sm bg-yellow-50 text-yellow-800 mb-4">
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Network Switch Required</span>
      </div>
      <p className="mb-3">
        Please switch to the Sepolia Testnet to deploy contracts.
        {chainId && ` Currently connected to chain ID: ${chainId}.`}
      </p>
      <button
        onClick={handleSwitchNetwork}
        disabled={isLoading}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Switching...' : 'Switch to Sepolia Testnet'}
      </button>
    </div>
  )
}