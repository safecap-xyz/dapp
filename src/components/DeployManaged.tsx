import { useState } from 'react';
import { Typography, Button, Input } from './ui';

// Type definitions
interface Wallet {
  walletAddress?: string;
  address?: string;
  userId?: string;
}

interface Campaign {
  id: string;
  name: string;
  contractAddress?: string;
  status?: string;
  deploymentTxHash?: string;
}

interface CampaignStatus {
  status: string;
  updatedAt: string;
}

interface TransactionResult {
  transactionHash: string;
  status: string;
}

interface CampaignData {
  userId: string;
  name: string;
  description: string;
  goal: string;
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
 * Creates a one-click campaign
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
 * Sends a transaction to a campaign
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
  
  // Start a one-click campaign
  const handleStartCampaign = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    
    if (!campaignName) {
      setError('Campaign name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const campaignData = {
        userId,
        name: campaignName,
        description: 'This campaign was created with one click!',
        goal: campaignGoal
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
      
      <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-6">
        <Typography variant="h3" className="mb-4">2. Create One-Click Campaign</Typography>
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
            <p><strong>Contract Address:</strong> {campaign.contractAddress}</p>
            <p><strong>Status:</strong> {campaign.status}</p>
            <p><strong>Deployment Transaction:</strong> {campaign.deploymentTxHash}</p>
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
