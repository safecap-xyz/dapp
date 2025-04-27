import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

interface CreateCampaignProps {
  onSuccess?: (campaignAddress: string) => void;
}

export function EnhancedCreateCampaign({ onSuccess }: CreateCampaignProps) {
  const [campaignName, setCampaignName] = useState('');
  const [fundingGoal, setFundingGoal] = useState('1.0');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managedWalletAddress, setManagedWalletAddress] = useState<string | null>(null);
  
  // Get account information from wagmi
  const { address, isConnected } = useAccount();
  
  // Get the connect function from wagmi
  const { connect, connectors } = useConnect();
  
  // Function to create a campaign with CDP wallet
  const createCampaignWithCDP = async () => {
    if (!campaignName || !fundingGoal || !description || !duration) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsCreating(true);
      setError(null);
      
      // If user is not connected, we'll use CDP to create a wallet for them
      if (!isConnected) {
        // In a real implementation, we would:
        // 1. Create a server-side managed wallet through CDP API
        // 2. Deploy a campaign contract with this wallet as the owner
        
        // For demo purposes, we'll simulate creating a managed wallet
        // with a random address
        const simulatedAddress = `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        setManagedWalletAddress(simulatedAddress);
        
        // Call onSuccess callback with the new campaign address
        if (onSuccess) {
          onSuccess(simulatedAddress);
        }
        
        console.log('Created simulated managed wallet:', simulatedAddress);
      } else {
        // If user is already connected, use their wallet
        setManagedWalletAddress(address as string);
        
        // Call onSuccess callback with the user's address
        if (onSuccess) {
          onSuccess(address as string);
        }
        
        console.log('Using connected wallet for campaign:', address);
      }
    } catch (err) {
      console.error('Error creating campaign with managed wallet:', err);
      setError(err instanceof Error ? err.message : 'Unknown error creating campaign');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 max-w-2xl mx-auto">
      <h2 className="text-xl font-secondary font-bold mb-4 text-text-primary">Campaign Details</h2>
      <div className="cyber-line w-full my-3"></div>
      
      {managedWalletAddress ? (
        <div className="text-center py-6">
          <div className="text-5xl text-secondary-main mb-4">✓</div>
          <h3 className="text-xl font-secondary font-bold mb-2 text-text-primary">Campaign Created!</h3>
          <p className="mb-4 text-text-primary font-primary">Your campaign has been created with a managed wallet.</p>
          <div className="bg-primary-dark/30 p-4 rounded-lg mb-4">
            <p className="text-sm text-text-secondary font-primary mb-2">Campaign Wallet Address:</p>
            <p className="font-mono text-secondary-light break-all">{managedWalletAddress}</p>
          </div>
          <button 
            onClick={() => {
              // Reset the form
              setCampaignName('');
              setFundingGoal('1.0');
              setDescription('');
              setDuration('30');
              setManagedWalletAddress(null);
            }}
            className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
          >
            Create Another Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-text-primary font-primary mb-2">Campaign Name</label>
            <input 
              type="text" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
              placeholder="Enter campaign name" 
            />
          </div>
          <div>
            <label className="block text-text-primary font-primary mb-2">Funding Goal (ETH)</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1" 
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
              placeholder="1.0" 
            />
          </div>
          <div>
            <label className="block text-text-primary font-primary mb-2">Campaign Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary h-32" 
              placeholder="Describe your campaign"
            ></textarea>
          </div>
          <div>
            <label className="block text-text-primary font-primary mb-2">Campaign Duration (days)</label>
            <input 
              type="number" 
              min="1" 
              max="90" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
              placeholder="30" 
            />
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="pt-4">
            <button 
              onClick={createCampaignWithCDP}
              disabled={isCreating}
              className={`w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none ${
                isCreating 
                  ? 'bg-secondary-main/50 text-secondary-contrast/50 cursor-not-allowed' 
                  : 'bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon'
              }`}
            >
              {isCreating ? 'Creating Campaign...' : isConnected ? 'Create Campaign with Your Wallet' : 'Create Campaign with Managed Wallet'}
            </button>
            <p className="text-xs text-text-secondary mt-2 text-center">No wallet needed! We'll create a managed wallet for your campaign.</p>
          </div>
        </div>
      )}
      
      {/* Connect Wallet Button */}
      {!isConnected && !managedWalletAddress && (
        <div className="mt-6 text-center">
          <p className="mb-4 text-text-secondary font-primary">You can also connect your own wallet:</p>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                // Find the first available connector (usually MetaMask or WalletConnect)
                const connector = connectors[0];
                if (connector) {
                  connect({ connector });
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-accent-main text-accent-contrast hover:bg-accent-light shadow-neon"
            >
              Connect Your Wallet
            </button>
          </div>
          <p className="mt-4 text-xs text-text-secondary font-primary">Using your own wallet gives you direct control over your campaign funds.</p>
        </div>
      )}
    </div>
  );
}
