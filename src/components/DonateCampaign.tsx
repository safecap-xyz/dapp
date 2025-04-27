import { useState, useEffect } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

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
      <div className="my-4 p-6 border rounded-lg shadow-md bg-neutral-light">
        <h2 className="text-xl font-secondary font-semibold mb-4 text-primary-dark">Donate to Campaign</h2>
        <p className="mb-4 font-primary text-text-secondary">Please connect your wallet to make a donation.</p>
      </div>
    )
  }

  return (
    <div className="my-4 p-6 border rounded-lg shadow-md bg-neutral-light">
      <h2 className="text-xl font-secondary font-semibold mb-4 text-primary-dark">Donate to Test Campaign</h2>

      {!isLoading && !isSuccess && !isError && (
        <div>
          <p className="mb-4 font-primary">Send a test donation to our sample campaign on Sepolia testnet.</p>
          <p className="mb-4 text-sm text-text-secondary font-primary">
            This will send a small amount of test ETH to the campaign contract at address: 
            <code className="bg-neutral-dark p-1 rounded font-mono">{campaignAddress}</code>
          </p>

          <div className="mb-4">
            <label htmlFor="donationAmount" className="block text-sm font-medium text-primary-dark mb-1 font-primary">
              Donation Amount (ETH)
            </label>
            <input
              type="text"
              id="donationAmount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="px-3 py-2 border border-neutral-dark rounded w-full max-w-xs font-primary focus:border-secondary-main focus:ring-1 focus:ring-secondary-light outline-none transition-all"
            />
          </div>

          <button
            onClick={handleDonate}
            className="px-4 py-2 bg-secondary-main text-secondary-contrast rounded font-primary font-medium hover:bg-secondary-dark transition-colors"
            disabled={isLoading || !isSepoliaNetwork}
          >
            {isLoading ? 'Processing...' : 'Donate Now'}
          </button>
          
          {!isSepoliaNetwork && (
            <p className="mt-2 text-sm text-warning-main font-primary">
              Please switch to the Sepolia network before donating.
            </p>
          )}
        </div>
      )}

      {isLoading && (
        <div>
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary-main mr-3"></div>
            <p className="font-primary">Processing your donation...</p>
          </div>
          <p className="text-sm text-text-secondary font-primary">Please keep this window open and confirm the transaction in your wallet if prompted.</p>
        </div>
      )}

      {isSuccess && (
        <div>
          <div className="flex items-center mb-4 text-success-main">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold font-primary">Donation Successful!</p>
          </div>
          
          <p className="mb-4 font-primary">Your donation of {donationAmount} ETH has been sent to the campaign.</p>
          
          <div className="text-sm text-text-secondary mb-4 font-primary">
            <p>You should soon receive an NFT as a thank you for your donation. Check your wallet to see it.</p>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 border border-secondary-main text-secondary-main rounded font-primary font-medium hover:bg-secondary-main/10 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      )}

      {isError && (
        <div>
          <div className="flex items-center mb-4 text-error-main">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold font-primary">Donation Failed</p>
          </div>

          <div className="bg-error-main/10 border border-error-main/20 rounded p-3 mb-4">
            <p className="text-error-main font-primary">{error?.message || 'Unknown error occurred during donation'}</p>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 bg-secondary-main text-secondary-contrast rounded font-primary font-medium hover:bg-secondary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DonateCampaign