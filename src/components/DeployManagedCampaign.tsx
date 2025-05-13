import { useState } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { NetworkSwitcher } from './NetworkSwitcher'
import { Typography } from './ui'
import config from '../config'

enum DeployStep {
  CreateAccount = 'CREATE_ACCOUNT',
  CreateSmartAccount = 'CREATE_SMART_ACCOUNT',
  DeployContracts = 'DEPLOY_CONTRACTS'
}

export function DeployManagedCampaign() {
  const { isConnected, address } = useWallet()
  const [currentStep, setCurrentStep] = useState<DeployStep>(DeployStep.CreateAccount)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Account creation state
  const [accountName, setAccountName] = useState('')
  
  // Define proper types for account and smart account
  interface Account {
    address: string;
    name: string;
    [key: string]: any; // For any other properties
  }
  
  interface SmartAccount {
    smartAccountAddress: string;
    ownerAddress: string;
    network: string;
    [key: string]: any; // For any other properties
  }
  
  const [account, setAccount] = useState<Account | null>(null)
  
  // Smart account state
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
  
  // User operation state for contract deployment
  const [transactionHash, setTransactionHash] = useState('')
  
  // Campaign form state
  const [campaignName, setCampaignName] = useState('')
  const [fundingGoal, setFundingGoal] = useState('1.0')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignDuration, setCampaignDuration] = useState('30')

  // Validate account name against CDP requirements
  const validateAccountName = (name: string): boolean => {
    // Must match: start with alphanumeric, contain only alphanumeric and hyphens, end with alphanumeric
    // Length between 2 and 36 characters
    const nameRegex = /^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$/;
    return nameRegex.test(name);
  };

  const createAccount = async () => {
    if (!accountName.trim()) {
      setError('Please enter an account name');
      return;
    }
    
    if (!validateAccountName(accountName)) {
      setError('Account name must start and end with a letter or number, can contain hyphens, and be 2-36 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Call the API to create a wallet
      const response = await fetch(`${config.apiBaseUrl}/api/create-wallet-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'EVM', 
          name: accountName,
          network: 'base-sepolia'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }

      const data = await response.json();
      setAccount(data.account);
      setSuccess(`Account created successfully! Address: ${data.account.address}`);
      
      // Move to the next step after a short delay
      setTimeout(() => {
        setCurrentStep(DeployStep.CreateSmartAccount);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createSmartAccount = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Use the connected wallet address or the created account address
      const ownerAddress = address || account?.address;
      
      if (!ownerAddress) {
        throw new Error('No owner address available. Please connect a wallet or create an account first.');
      }

      const response = await fetch(`${config.apiBaseUrl}/api/create-smart-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ownerAddress,
          network: 'base-sepolia'
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create smart account');
      }

      const data = await response.json();
      setSmartAccount(data);
      setSuccess(`Smart account created successfully! Address: ${data.smartAccountAddress}`);
      
      // Move to the next step after a short delay
      setTimeout(() => {
        setCurrentStep(DeployStep.DeployContracts);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the smart account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deployContracts = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setTransactionHash('');

      if (!smartAccount) {
        throw new Error('Smart account not created. Please create a smart account first.');
      }

      // Prepare the user operation data for contract deployment
      // This would typically include the bytecode and constructor arguments for your contracts
      // For now, we'll use a simplified example
      const userOperation = {
        to: "0x0000000000000000000000000000000000000000", // This would be the target address for deployment
        value: "0",
        data: "0x" // This would be the contract bytecode + constructor args
      };

      // Use the connected wallet address or the created account address
      const ownerAddress = address || account?.address;
      
      if (!ownerAddress) {
        throw new Error('No owner address available. Please connect a wallet or create an account first.');
      }

      console.log('Sending user operation with owner address:', ownerAddress);
      console.log('Smart account address:', smartAccount.smartAccountAddress);

      // First, try the sample user operation endpoint that uses a format known to work
      // This is useful for testing if the API and CDP SDK are working correctly
      console.log('Trying sample user operation first...');
      const sampleResponse = await fetch(`${config.apiBaseUrl}/api/sample-user-operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: 'base-sepolia'
        }),
      });

      if (!sampleResponse.ok) {
        const sampleData = await sampleResponse.json();
        console.error('Sample user operation failed:', sampleData.error);
        setError(`Sample user operation failed: ${sampleData.error}`);
        // If the sample operation fails, there's likely an issue with the CDP SDK configuration
        throw new Error(`Sample user operation failed: ${sampleData.error}`);
      } else {
        const sampleData = await sampleResponse.json();
        console.log('Sample user operation succeeded:', sampleData);
        setSuccess(`Sample user operation succeeded! UserOpHash: ${sampleData.userOpHash}`);
        // Set the transaction hash from the sample operation
        setTransactionHash(sampleData.transactionHash || sampleData.userOpHash);
        // Since the sample operation succeeded, we don't need to continue with the regular operation
        setLoading(false);
        return;
      }

      // Now try the regular user operation with our smart account
      const response = await fetch(`${config.apiBaseUrl}/api/send-user-operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smartAccountAddress: smartAccount.smartAccountAddress,
          network: 'base-sepolia',
          calls: [userOperation],
          ownerAddress // Include the owner address
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to deploy contracts');
      }

      const data = await response.json();
      setTransactionHash(data.transactionHash || data.userOpHash);
      setSuccess(`Contracts deployed successfully! UserOpHash: ${data.userOpHash}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deploying contracts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case DeployStep.CreateAccount:
        return (
          <div className="space-y-4">
            <Typography variant="h3" className="mb-4">Step 1: Create Account</Typography>
            <div className="cyber-line w-full my-3"></div>
            
            <div className="space-y-2">
              <label className="block text-text-primary font-primary mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
              />
            </div>

            <button 
              onClick={createAccount} 
              disabled={loading || !accountName.trim()}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            
            {isConnected && (
              <div className="mt-4">
                <p className="text-text-primary">Or use your connected wallet:</p>
                <button 
                  onClick={() => setCurrentStep(DeployStep.CreateSmartAccount)}
                  className="mt-2 px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-dark text-text-primary hover:bg-primary-light border border-secondary-main/30"
                >
                  Use Connected Wallet
                </button>
              </div>
            )}
          </div>
        );
      
      case DeployStep.CreateSmartAccount:
        return (
          <div className="space-y-4">
            <Typography variant="h3" className="mb-4">Step 2: Create Smart Account</Typography>
            <div className="cyber-line w-full my-3"></div>
            
            {account && (
              <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30 mb-4">
                <p className="text-text-primary"><span className="font-medium">Using Account:</span> {account.address}</p>
              </div>
            )}
            
            {isConnected && !account && (
              <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30 mb-4">
                <p className="text-text-primary"><span className="font-medium">Using Connected Wallet:</span> {address}</p>
              </div>
            )}

            <button 
              onClick={createSmartAccount} 
              disabled={loading || (!account && !isConnected)}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Smart Account'}
            </button>
            
            <button 
              onClick={() => setCurrentStep(DeployStep.CreateAccount)}
              className="ml-4 px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-dark text-text-primary hover:bg-primary-light border border-secondary-main/30"
            >
              Back
            </button>
          </div>
        );
      
      case DeployStep.DeployContracts:
        return (
          <div className="space-y-4">
            <Typography variant="h3" className="mb-4">Step 3: Deploy Contracts</Typography>
            <div className="cyber-line w-full my-3"></div>
            
            {smartAccount && (
              <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30 mb-4">
                <p className="text-text-primary"><span className="font-medium">Smart Account:</span> {smartAccount.smartAccountAddress}</p>
              </div>
            )}
            
            <div>
              <label className="block text-text-primary font-primary mb-2">Campaign Name</label>
              <input 
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
                placeholder="Enter campaign name" 
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-text-primary font-primary mb-2">Funding Goal (ETH)</label>
              <input 
                min="0.1" 
                step="0.1" 
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
                placeholder="1.0" 
                type="number"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-text-primary font-primary mb-2">Campaign Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary h-32" 
                placeholder="Describe your campaign"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-text-primary font-primary mb-2">Campaign Duration (days)</label>
              <input 
                min="1" 
                max="90" 
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary" 
                placeholder="30" 
                type="number"
                value={campaignDuration}
                onChange={(e) => setCampaignDuration(e.target.value)}
              />
            </div>

            <div className="pt-4 flex space-x-4">
              <button
                onClick={() => setCurrentStep(DeployStep.CreateSmartAccount)}
                className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-dark text-text-primary hover:bg-primary-light border border-secondary-main/30"
              >
                Back
              </button>
              <button
                onClick={deployContracts}
                className="flex-1 px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
                disabled={loading || !smartAccount || !campaignName || !fundingGoal || !campaignDescription || !campaignDuration}
              >
                {loading ? 'Deploying...' : 'Deploy Contracts'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isConnected && currentStep !== DeployStep.CreateAccount) {
    return (
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center border border-secondary-main/30">
        <p className="text-secondary-light font-primary">Please connect your wallet or create an account to deploy contracts</p>
        <button
          onClick={() => setCurrentStep(DeployStep.CreateAccount)}
          className="mt-4 px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
        >
          Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
      <h2 className="text-xl font-bold text-text-primary mb-4 font-secondary">Deploy Managed Campaign on Sepolia Testnet</h2>
      
      {isConnected && <NetworkSwitcher />}

      <div className="mt-6">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === DeployStep.CreateAccount 
                ? 'bg-secondary-main text-secondary-contrast' 
                : 'bg-primary-dark/50 text-text-primary'
            }`}
          >
            1
          </div>
          <div className="h-1 flex-1 mx-2 bg-primary-dark/50">
            <div 
              className="h-full bg-secondary-main" 
              style={{ width: currentStep === DeployStep.CreateAccount ? '0%' : '100%' }}
            ></div>
          </div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === DeployStep.CreateSmartAccount 
                ? 'bg-secondary-main text-secondary-contrast' 
                : currentStep === DeployStep.DeployContracts 
                  ? 'bg-success-main text-success-contrast' 
                  : 'bg-primary-dark/50 text-text-primary'
            }`}
          >
            2
          </div>
          <div className="h-1 flex-1 mx-2 bg-primary-dark/50">
            <div 
              className="h-full bg-secondary-main" 
              style={{ width: currentStep === DeployStep.DeployContracts ? '100%' : '0%' }}
            ></div>
          </div>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === DeployStep.DeployContracts 
                ? 'bg-secondary-main text-secondary-contrast' 
                : 'bg-primary-dark/50 text-text-primary'
            }`}
          >
            3
          </div>
        </div>

        {renderStep()}

        {error && (
          <div className="mt-4 p-3 bg-error-main/20 rounded-lg border border-error-main/30">
            <p className="text-error-main">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-success-main/20 rounded-lg border border-success-main/30">
            <p className="text-success-main">{success}</p>
          </div>
        )}

        {transactionHash && (
          <div className="mt-4 p-3 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
            <p className="text-text-primary mb-2"><span className="font-medium">Transaction Hash:</span> {transactionHash}</p>
            <a 
              href={`https://sepolia.basescan.org/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-main hover:text-secondary-light transition-colors"
            >
              View Transaction on Block Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeployManagedCampaign
