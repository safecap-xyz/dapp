import { useState } from 'react';
import { useWallet } from '../web3/hooks/useWallet';
import { parseEther } from 'viem';
import { 
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';

interface EnhancedDonateCampaignProps {
  campaignAddress: string;
}

export function EnhancedDonateCampaign({ campaignAddress }: EnhancedDonateCampaignProps) {
  const { isConnected, isSepoliaNetwork } = useWallet();
  const [donationAmount, setDonationAmount] = useState("0.01");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  
  // Prepare transaction call
  const prepareDonationCall = async () => {
    // Return a call object for the transaction
    return [{
      to: campaignAddress as `0x${string}`,
      value: parseEther(donationAmount),
      data: '0x' // No data for simple ETH transfer
    }];
  };
  
  // Define types for status and response
  type TransactionStatus = {
    statusName: string;
    [key: string]: any;
  };
  
  type TransactionResponse = {
    hash: string;
    [key: string]: any;
  };

  return (
    <div className="my-4 p-6 border rounded-lg shadow-neon bg-neutral-light/10 glass-panel">
      <h2 className="text-xl font-bold mb-4 font-secondary text-text-primary glow-text">Donate to Campaign</h2>
      
      {!isConnected ? (
        <div className="p-4 mb-4 bg-primary-dark/30 rounded-md text-text-primary font-primary">
          Please connect your wallet to donate.
        </div>
      ) : !isSepoliaNetwork ? (
        <div className="p-4 mb-4 bg-warning-main/20 rounded-md text-warning-main font-primary">
          Please switch to Sepolia network to donate.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="donationAmount" className="block text-sm font-medium mb-1 font-primary text-text-primary">
              Donation Amount (ETH)
            </label>
            <input
              id="donationAmount"
              type="number"
              min="0.001"
              step="0.001"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-mono"
            />
          </div>
          
          <div className="mb-4 p-3 bg-secondary-main/10 rounded-md font-primary text-text-primary">
            <p className="text-sm">
              You are about to donate <span className="font-bold text-secondary-main">{donationAmount} ETH</span> to campaign address: 
              <span className="block mt-1 font-mono text-xs break-all">{campaignAddress}</span>
            </p>
          </div>
          
          <Transaction
            calls={prepareDonationCall}
            onStatus={(status: TransactionStatus) => {
              console.log('Transaction status:', status);
              setTransactionStatus(status.statusName);
            }}
            onSuccess={(response: TransactionResponse) => {
              console.log('Transaction successful:', response);
            }}
            onError={(error: Error) => {
              console.error('Transaction error:', error);
            }}
          >
            <TransactionButton 
              text={`Donate ${donationAmount} ETH`}
              className="w-full px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light"
            />
            
            <div className="mt-4">
              <TransactionStatus>
                <div className="p-3 bg-primary-dark/30 rounded-md">
                  <div className="flex items-center justify-between">
                    <TransactionStatusLabel className="text-text-primary font-primary" />
                    <TransactionStatusAction className="text-secondary-main hover:text-secondary-light" />
                  </div>
                </div>
              </TransactionStatus>
            </div>
            
            {/* TransactionToast component not available in current version */}
          </Transaction>
          
          {transactionStatus === 'success' && (
            <div className="mt-4 p-3 bg-success-main/20 rounded-md text-success-main font-primary">
              Donation successful! Thank you for your contribution.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
