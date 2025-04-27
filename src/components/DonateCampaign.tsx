import { useState, useEffect } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

interface DonateCampaignProps {
  campaignAddress: string
}

export function DonateCampaign({ campaignAddress }: DonateCampaignProps) {
  const { isConnected } = useWallet()
  const [donationAmount, setDonationAmount] = useState("0.01")
  
  // Using wagmi hooks directly for transactions
  const { data: hash, isPending, sendTransaction, error: sendError } = useSendTransaction()
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash
  })
  
  // Combined states
  const isLoading = isPending || isConfirming
  const error = sendError || receiptError
  const isError = !!error
  
  // Reset function for UI state
  const reset = () => {
    // Force UI reset logic
    window.location.reload()
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
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center border border-secondary-main/30">
        <p className="text-secondary-light font-primary">Please connect your wallet to make a donation</p>
      </div>
    )
  }

  return (
    <div>
      {/* Title is shown in the parent component */}

      {!isLoading && !isSuccess && !isError && (
        <div>
          <p className="mb-4 text-text-primary font-primary">Send ETH to support this campaign on Sepolia testnet.</p>
          <p className="mb-4 text-sm text-text-secondary font-primary">
            Campaign address: 
            <span className="font-mono text-secondary-light ml-2">{campaignAddress}</span>
          </p>

          <div className="mb-6">
            <label htmlFor="donationAmount" className="block text-sm font-medium text-text-primary font-primary mb-2">
              Donation Amount (ETH)
            </label>
            <input
              type="text"
              id="donationAmount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary w-full"
            />
          </div>

          <button
            onClick={handleDonate}
            className="w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Donate ${donationAmount} ETH`}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-6">
          <div className="flex items-center justify-center mb-4 text-secondary-main">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-secondary font-bold text-lg">
              {isPending ? 'Waiting for wallet confirmation...' : 'Transaction processing...'}
            </p>
          </div>
          
          {hash && (
            <div className="mb-6 bg-primary-dark/30 p-4 rounded-lg border border-secondary-main/30">
              <p className="text-sm text-text-secondary font-primary mb-2">Transaction Hash:</p>
              <p className="font-mono text-secondary-light text-sm break-all">{hash}</p>
            </div>
          )}
          
          <p className="text-text-secondary font-primary">
            {isPending 
              ? 'Please confirm the transaction in your wallet' 
              : 'Transaction submitted. Waiting for confirmation...'}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="text-center py-6">
          <div className="text-5xl text-success-main mb-4">✓</div>
          <h3 className="text-xl font-secondary font-bold mb-4 text-text-primary">Donation Successful!</h3>
          
          {hash && (
            <div className="mb-6 bg-primary-dark/30 p-4 rounded-lg border border-secondary-main/30">
              <p className="text-sm text-text-secondary font-primary mb-2">Transaction Hash:</p>
              <p className="font-mono text-secondary-light text-sm break-all">{hash}</p>
            </div>
          )}
          
          <p className="mb-6 text-text-primary font-primary">
            Your donation has been successfully sent to the campaign. Thank you for your support!
          </p>
          
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
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