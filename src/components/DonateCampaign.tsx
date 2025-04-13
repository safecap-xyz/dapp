import { useState, useEffect } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

// Campaign ABI - only the functions we need
const campaignAbi = [
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "fundingActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

interface DonateCampaignProps {
  campaignAddress: string
}

export function DonateCampaign({ campaignAddress }: DonateCampaignProps) {
  const { isConnected, isSepoliaNetwork } = useWallet()
  const [donationAmount, setDonationAmount] = useState("0.01")
  
  // Using wagmi hooks directly for transactions
  const { data: hash, isPending, sendTransaction, error: sendError } = useSendTransaction()
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash
  })
  
  // Combined states
  const isLoading = isPending || isConfirming
  const error = sendError || receiptError
  const isError = !!error
  
  // Reset function for UI state
  const [uiReset, setUiReset] = useState(0)
  const reset = () => {
    setUiReset(prev => prev + 1)
  }
  
  // Handle the donation
  const handleDonate = async () => {
    try {
      console.log('Sending donation transaction...')
      console.log('Campaign address:', campaignAddress)
      console.log('Amount:', donationAmount, 'ETH')
      
      sendTransaction({
        to: campaignAddress as `0x${string}`,
        value: parseEther(donationAmount)
      })
    } catch (err) {
      console.error("Error sending donation:", err)
    }
  }
  
  // Effect to log transaction status changes
  useEffect(() => {
    if (isPending) {
      console.log('Transaction pending - waiting for user confirmation')
    }
    if (isConfirming) {
      console.log('Transaction sent, waiting for confirmation. Hash:', hash)
    }
    if (isSuccess) {
      console.log('Transaction successful!')
    }
    if (error) {
      console.error('Transaction error:', error)
    }
  }, [isPending, isConfirming, isSuccess, error, hash])

  if (!isConnected) {
    return (
      <div className="my-4 p-6 border rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Donate to Campaign</h2>
        <p className="mb-4">Please connect your wallet to make a donation.</p>
      </div>
    )
  }

  return (
    <div className="my-4 p-6 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Donate to Test Campaign</h2>

      {!isLoading && !isSuccess && !isError && (
        <div>
          <p className="mb-4">Send a test donation to our sample campaign on Sepolia testnet.</p>
          <p className="mb-4 text-sm text-gray-600">
            This will send a small amount of test ETH to the campaign contract at address: 
            <code className="bg-gray-100 p-1 rounded">{campaignAddress}</code>
          </p>

          <div className="mb-4">
            <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Donation Amount (ETH)
            </label>
            <input
              type="text"
              id="donationAmount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="px-3 py-2 border rounded w-full max-w-xs"
            />
          </div>

          <button
            onClick={handleDonate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isLoading || !isSepoliaNetwork}
          >
            {isLoading ? 'Processing...' : 'Donate Now'}
          </button>
          
          {!isSepoliaNetwork && (
            <p className="mt-2 text-sm text-orange-600">
              Please switch to the Sepolia network before donating.
            </p>
          )}
        </div>
      )}

      {isLoading && (
        <div>
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
            <p>Processing your donation...</p>
          </div>
          <p className="text-sm text-gray-600">Please keep this window open and confirm the transaction in your wallet if prompted.</p>
        </div>
      )}

      {isSuccess && (
        <div>
          <div className="flex items-center mb-4 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold">Donation Successful!</p>
          </div>
          
          <p className="mb-4">Your donation of {donationAmount} ETH has been sent to the campaign.</p>
          
          <div className="text-sm text-gray-600 mb-4">
            <p>You should soon receive an NFT as a thank you for your donation. Check your wallet to see it.</p>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      )}

      {isError && (
        <div>
          <div className="flex items-center mb-4 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">Donation Failed</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-700">{error?.message || 'Unknown error occurred during donation'}</p>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DonateCampaign