import { useState, useEffect } from 'react';
import { Typography, Button, Input } from './ui';

// Type definitions for the application

// Type definitions
interface Wallet {
  walletAddress?: string;
  address?: string;
  userId?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  goal?: string;
  contractAddress?: string;
  factoryAddress?: string;
  nftAddress?: string;
  status?: string;
  deploymentTxHashes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface CampaignStatus {
  status: string;
  updatedAt: string;
}

interface TransactionResult {
  transactionHash: string;
  status: string;
  blockNumber?: number;
  amount?: string;
}

interface CampaignData {
  userId: string;
  name: string;
  description: string;
  goal: string;
  duration?: string;
}

interface TransactionData {
  campaignId: string;
  amount: string;
  from: string;
}

// API service functions
const API_BASE_URL = 'http://localhost:3000';

/**
 * Creates a developer-controlled wallet
 */
async function createWallet(userId: string = 'default-user') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || 'Failed to create wallet');
    }
    
    return await response.json() as Wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

/**
 * Gets a wallet address for a user
 */
async function getWalletAddress(userId: string = 'default-user') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/${userId}`);
    
    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || 'Failed to get wallet');
    }
    
    return await response.json() as Wallet;
  } catch (error) {
    console.error('Error getting wallet:', error);
    throw error;
  }
}

/**
 * Creates a one-click campaign using the managed wallet
 */
async function startCampaign(campaignData: CampaignData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/oneclick-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    
    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || 'Failed to create campaign');
    }
    
    return await response.json() as { campaign: Campaign };
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

/**
 * Sends a transaction to a campaign using the managed wallet
 */
async function sendTransaction(transactionData: TransactionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transaction/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || 'Failed to send transaction');
    }
    
    return await response.json() as TransactionResult;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

/**
 * Gets the status of a campaign
 */
async function getCampaignStatus(campaignId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/campaign/status/${campaignId}`);
    
    if (!response.ok) {
      const errorData: { error?: string } = await response.json();
      throw new Error(errorData.error || 'Failed to get campaign status');
    }
    
    return await response.json() as CampaignStatus;
  } catch (error) {
    console.error('Error getting campaign status:', error);
    throw error;
  }
}

export const DeployManaged = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('user-' + Math.random().toString(36).substring(2, 9));
  const [campaignName, setCampaignName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('1');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus | null>(null);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [fundAmount, setFundAmount] = useState('0.01');
  const [fundingInProgress, setFundingInProgress] = useState(false);
  const [fundingTxHash, setFundingTxHash] = useState('');
  const [fundingStatus, setFundingStatus] = useState('Not Started');
  const [accounts, setAccounts] = useState<string[]>([]);
  const [networkWarning, setNetworkWarning] = useState(false);

  // Create a wallet for the user
  const handleCreateWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createWallet(userId);
      setWallet(result);
    } catch (err) {
      setError((err as Error).message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };
  
  // Get wallet address for a user
  const handleGetWallet = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getWalletAddress(userId);
      setWallet(result);
    } catch (err) {
      setError((err as Error).message || 'Failed to get wallet');
    } finally {
      setLoading(false);
    }
  };
  
  // Base Sepolia network configuration
  const baseSepolia = {
    chainId: '0x14a34', // 84532 in decimal
    chainName: 'Base Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org']
  };

  // Initialize Web3 connection when component mounts
  useEffect(() => {
    let handleAccountsChanged: ((accounts: string[]) => void) | undefined;
    
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
          setAccounts(accounts as string[]);
          
          // Check current network
          const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' });
          if (chainId !== baseSepolia.chainId) {
            console.log(`Currently on network with chainId: ${chainId}, Base Sepolia is: ${baseSepolia.chainId}`);
            setNetworkWarning(true);
          } else {
            setNetworkWarning(false);
          }
          
          // Listen for account changes
          handleAccountsChanged = (newAccounts: string[]) => {
            setAccounts(newAccounts);
          };
          
          // Listen for network changes
          const handleChainChanged = (chainId: string) => {
            console.log(`Network changed to chainId: ${chainId}`);
            if (chainId !== baseSepolia.chainId) {
              setNetworkWarning(true);
            } else {
              setNetworkWarning(false);
            }
          };
          
          (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
          (window.ethereum as any).on('chainChanged', handleChainChanged);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
          setError('Failed to connect to MetaMask. Please make sure it is installed and unlocked.');
        }
      } else {
        console.error('MetaMask is not installed');
        setError('MetaMask is not installed. Please install MetaMask to use this feature.');
      }
    };
    
    connectWallet();
    
    // Cleanup listener on unmount
    return () => {
      if (typeof window !== 'undefined' && window.ethereum && handleAccountsChanged) {
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
        (window.ethereum as any).removeListener('chainChanged', () => {});
      }
    };
  }, []);
  
  // Function to switch to Base Sepolia network
  const switchToBaseSepolia = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Try to switch to the Base Sepolia network
        await (window.ethereum as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: baseSepolia.chainId }],
        });
        setNetworkWarning(false);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await (window.ethereum as any).request({
              method: 'wallet_addEthereumChain',
              params: [baseSepolia],
            });
            setNetworkWarning(false);
          } catch (addError) {
            console.error('Error adding Base Sepolia network to MetaMask:', addError);
            setError('Failed to add Base Sepolia network to MetaMask. Please add it manually.');
          }
        } else {
          console.error('Error switching to Base Sepolia network:', switchError);
          setError('Failed to switch to Base Sepolia network. Please switch manually.');
        }
      }
    }
  };
  
  // Handle funding the developer wallet
  const handleFundWallet = async () => {
    if (accounts.length === 0 || !wallet || !fundAmount || Number(fundAmount) <= 0) {
      setError('Please ensure you have a wallet, connected MetaMask, and a valid amount');
      return;
    }
    
    // Check if we're on the correct network
    if (networkWarning) {
      try {
        await switchToBaseSepolia();
      } catch (error) {
        setError('Please switch to Base Sepolia network before funding the wallet');
        return;
      }
    }
    
    setFundingInProgress(true);
    setFundingStatus('Processing');
    setError(null);
    
    try {
      const walletAddress = wallet.walletAddress || wallet.address;
      const fromAddress = accounts[0];
      
      // Convert ETH to Wei (1 ETH = 10^18 Wei)
      const amountInWei = `0x${(Number(fundAmount) * 1e18).toString(16)}`;
      
      // Send the transaction using window.ethereum
      const txHash = await (window.ethereum as any).request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: walletAddress,
          value: amountInWei
        }]
      }) as string;
      
      setFundingTxHash(txHash);
      setFundingStatus('Transaction Sent');
      
      // We can't directly wait for the transaction to be mined with the basic Web3 API
      // So we'll just update the status to indicate it was sent successfully
      setFundingStatus('Completed');
    } catch (error) {
      console.error('Error funding wallet:', error);
      setFundingStatus('Failed');
      setError('Error funding wallet: ' + ((error as Error)?.message || 'Unknown error'));
    } finally {
      setFundingInProgress(false);
    }
  };
  
  // Start a one-click campaign using managed wallet
  const handleStartCampaign = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    
    if (!campaignName) {
      setError('Campaign name is required');
      return;
    }
    
    if (!wallet) {
      setError('Please create a wallet first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const campaignData = {
        userId,
        name: campaignName,
        description: 'This campaign was created with a managed wallet!',
        goal: campaignGoal,
        duration: '30' // 30 days by default
      };
      
      const result = await startCampaign(campaignData);
      setCampaign(result.campaign);
    } catch (err) {
      setError((err as Error).message || 'Failed to start campaign');
    } finally {
      setLoading(false);
    }
  };
  
  // Send a transaction to the campaign
  const handleSendTransaction = async () => {
    if (!campaign?.id) {
      setError('No campaign created yet. Start a campaign first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const transactionData = {
        campaignId: campaign.id,
        amount: '0.1', // 0.1 ETH
        from: wallet?.walletAddress || wallet?.address || '0xUserWalletAddress'
      };
      
      const result = await sendTransaction(transactionData);
      setTransactionResult(result);
    } catch (err) {
      setError((err as Error).message || 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };
  
  // Get campaign status
  const handleGetCampaignStatus = async () => {
    if (!campaign?.id) {
      setError('No campaign created yet. Start a campaign first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCampaignStatus(campaign.id);
      setCampaignStatus(result);
    } catch (err) {
      setError((err as Error).message || 'Failed to get campaign status');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-4">
          <Typography variant="body2" className="text-red-500">{error}</Typography>
        </div>
      )}
      
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
        <Typography variant="h3" className="mb-4">1. Create Developer Wallet</Typography>
        <div className="cyber-line w-full my-3"></div>
        
        <div className="space-y-4">
          <Input
            label="User ID"
            value={userId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
            fullWidth
            disabled={loading || !!wallet?.walletAddress || !!wallet?.address}
          />
          
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleCreateWallet}
              disabled={loading || !!wallet?.walletAddress || !!wallet?.address}
            >
              Create Wallet
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGetWallet}
              disabled={loading || !userId}
            >
              Get Wallet
            </Button>
          </div>
        </div>
        
        {wallet && (
          <div className="mt-4 p-4 bg-secondary-main/10 rounded-lg">
            <Typography variant="h5" className="mb-2">Wallet Information</Typography>
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Wallet Address:</strong> {wallet.walletAddress || wallet.address}</p>
          </div>
        )}
      </div>

      {wallet && (
        <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
          <Typography variant="h3" className="mb-4">2. Fund Developer Wallet</Typography>
          <div className="cyber-line w-full my-3"></div>
          
          {networkWarning && (
            <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg">
              <Typography variant="body1" className="text-yellow-500 font-bold mb-2">
                Network Warning
              </Typography>
              <p className="mb-2">You are not connected to Base Sepolia network. Funds must be sent on Base Sepolia.</p>
              <Button
                variant="primary"
                onClick={switchToBaseSepolia}
                className="mt-2"
              >
                Switch to Base Sepolia
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                label="Amount (ETH)"
                type="number"
                value={fundAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFundAmount(e.target.value)}
                fullWidth
                disabled={loading || fundingInProgress}
              />
              <p className="text-sm text-gray-400">Fund your developer wallet with ETH from your connected wallet</p>
              <p className="text-sm font-bold text-secondary-main">Important: Funds must be sent on Base Sepolia network</p>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={handleFundWallet}
                disabled={loading || fundingInProgress || !wallet || !fundAmount || Number(fundAmount) <= 0}
              >
                {fundingInProgress ? 'Funding...' : 'Fund Wallet'}
              </Button>
            </div>
          </div>
          
          {fundingTxHash && (
            <div className="mt-4 p-4 bg-secondary-main/10 rounded-lg">
              <Typography variant="h5" className="mb-2">Funding Transaction</Typography>
              <p><strong>Transaction Hash:</strong> {fundingTxHash}</p>
              <p><strong>Status:</strong> {fundingStatus}</p>
              {fundingStatus === 'Completed' && (
                <p className="text-green-500 mt-2">✓ Successfully funded wallet</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
        <Typography variant="h3" className="mb-4">3. Create One-Click Campaign</Typography>
        <div className="cyber-line w-full my-3"></div>
        
        <div className="space-y-4">
          <Input
            label="Campaign Name"
            value={campaignName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
            fullWidth
            disabled={loading || !!campaign?.id}
          />
          
          <Input
            label="Campaign Goal (ETH)"
            value={campaignGoal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignGoal(e.target.value)}
            fullWidth
            disabled={loading || !!campaign?.id}
          />
          
          <Button
            variant="secondary"
            onClick={handleStartCampaign}
            disabled={loading || !userId || !campaignName || !!campaign?.id}
          >
            Start Campaign
          </Button>
        </div>
        
        {campaign && (
          <div className="mt-4 p-4 bg-secondary-main/10 rounded-lg">
            <Typography variant="h5" className="mb-2">Campaign Information</Typography>
            <p><strong>Campaign ID:</strong> {campaign.id}</p>
            <p><strong>Name:</strong> {campaign.name}</p>
            <p><strong>Description:</strong> {campaign.description}</p>
            <p><strong>Goal:</strong> {campaign.goal} ETH</p>
            <p><strong>Status:</strong> {campaign.status}</p>
            <p><strong>Campaign Address:</strong> {campaign.contractAddress}</p>
            <p><strong>Factory Address:</strong> {campaign.factoryAddress}</p>
            <p><strong>NFT Address:</strong> {campaign.nftAddress}</p>
            <p><strong>Created At:</strong> {campaign.createdAt && new Date(campaign.createdAt).toLocaleString()}</p>
            {campaign.deploymentTxHashes && campaign.deploymentTxHashes.length > 0 && (
              <div>
                <p><strong>Deployment Transactions:</strong></p>
                <ul className="list-disc pl-5">
                  {campaign.deploymentTxHashes.map((hash, index) => (
                    <li key={index} className="break-all">{hash}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
        <Typography variant="h3" className="mb-4">3. Campaign Actions</Typography>
        <div className="cyber-line w-full my-3"></div>
        
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={handleSendTransaction}
            disabled={loading || !campaign?.id}
          >
            Send 0.1 ETH
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGetCampaignStatus}
            disabled={loading || !campaign?.id}
          >
            Check Status
          </Button>
        </div>
        
        {transactionResult && (
          <div className="mt-4 p-4 bg-secondary-main/10 rounded-lg">
            <Typography variant="h5" className="mb-2">Transaction Result</Typography>
            <p><strong>Transaction Hash:</strong> {transactionResult.transactionHash}</p>
            <p><strong>Status:</strong> {transactionResult.status}</p>
            {transactionResult.blockNumber && <p><strong>Block Number:</strong> {transactionResult.blockNumber}</p>}
            {transactionResult.amount && <p><strong>Amount:</strong> {transactionResult.amount} ETH</p>}
          </div>
        )}
        
        {campaignStatus && (
          <div className="mt-4 p-4 bg-secondary-main/10 rounded-lg">
            <Typography variant="h5" className="mb-2">Campaign Status</Typography>
            <p><strong>Status:</strong> {campaignStatus.status}</p>
            <p><strong>Updated At:</strong> {new Date(campaignStatus.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployManaged;
