import { useState } from 'react';
import { useContractDeployment, DeploymentStep } from '../web3/services/DeploymentService';
import { useWallet } from '../web3/hooks/useWallet';
import { NetworkSwitcher } from './NetworkSwitcher';
import { 
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';

export function EnhancedDeployContracts() {
  const { isConnected, isSepoliaNetwork } = useWallet();
  
  const {
    isDeploying,
    isSuccess,
    isError,
    factoryAddress,
    nftAddress,
    sampleCampaignAddress,
    error,
    step,
    deployContracts,
    reset
  } = useContractDeployment();

  const [copied, setCopied] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({...copied, [key]: true});
    setTimeout(() => {
      setCopied({...copied, [key]: false});
    }, 2000);
  };

  const getStepDescription = (currentStep: DeploymentStep) => {
    switch(currentStep) {
      case DeploymentStep.DeployingTempFactory:
        return 'Deploying temporary factory contract...';
      case DeploymentStep.DeployingNFT:
        return 'Deploying NFT contract...';
      case DeploymentStep.DeployingFinalFactory:
        return 'Deploying final factory contract...';
      case DeploymentStep.UpdatingNFT:
        return 'Updating NFT contract to point to final factory...';
      case DeploymentStep.CreatingSampleCampaign:
        return 'Creating a sample campaign...';
      case DeploymentStep.Completed:
        return 'Deployment completed successfully!';
      default:
        return 'Ready to deploy contracts';
    }
  };

  return (
    <div className="my-4 p-6 border rounded-lg shadow-neon bg-neutral-light/10 glass-panel">
      <h2 className="text-xl font-bold mb-4 font-secondary text-text-primary glow-text">Deploy Contracts</h2>
      
      {!isConnected ? (
        <div className="p-4 mb-4 bg-primary-dark/30 rounded-md text-text-primary font-primary">
          <p>Please connect your wallet to deploy contracts.</p>
        </div>
      ) : !isSepoliaNetwork ? (
        <div className="p-4 mb-4 bg-warning-main/20 rounded-md text-warning-main font-primary">
          <p>Please switch to Sepolia network for deployment.</p>
          <div className="mt-2">
            <NetworkSwitcher />
          </div>
        </div>
      ) : isSuccess ? (
        <div className="space-y-4">
          <div className="p-4 bg-success-main/20 rounded-md text-success-main font-primary">
            <p className="font-bold">Deployment completed successfully!</p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-primary-dark/30 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-text-primary font-primary">Factory Contract:</span>
                <button 
                  onClick={() => copyToClipboard(factoryAddress || '', 'factory')}
                  className="text-secondary-main hover:text-secondary-light text-sm"
                >
                  {copied['factory'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="mt-1 font-mono text-xs break-all text-secondary-light">{factoryAddress}</div>
            </div>
            
            <div className="p-3 bg-primary-dark/30 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-text-primary font-primary">NFT Contract:</span>
                <button 
                  onClick={() => copyToClipboard(nftAddress || '', 'nft')}
                  className="text-secondary-main hover:text-secondary-light text-sm"
                >
                  {copied['nft'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="mt-1 font-mono text-xs break-all text-secondary-light">{nftAddress}</div>
            </div>
            
            <div className="p-3 bg-primary-dark/30 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-text-primary font-primary">Sample Campaign:</span>
                <button 
                  onClick={() => copyToClipboard(sampleCampaignAddress || '', 'campaign')}
                  className="text-secondary-main hover:text-secondary-light text-sm"
                >
                  {copied['campaign'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="mt-1 font-mono text-xs break-all text-secondary-light">{sampleCampaignAddress}</div>
            </div>
          </div>
          
          <button
            onClick={reset}
            className="w-full px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-light text-primary-contrast hover:bg-primary-main"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {isError && (
            <div className="p-4 mb-4 bg-error-main/20 rounded-md text-error-main font-primary">
              <p className="font-bold">Deployment Error</p>
              <p className="text-sm mt-1">{error?.message || 'An unknown error occurred'}</p>
              <button
                onClick={reset}
                className="mt-2 px-3 py-1 text-xs font-medium rounded font-primary transition-colors focus:outline-none bg-error-main text-error-contrast hover:bg-error-main/80"
              >
                Reset
              </button>
            </div>
          )}
          
          {isDeploying ? (
            <div className="space-y-4">
              <div className="p-4 bg-secondary-main/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium font-primary text-text-primary">Deployment Progress</h3>
                  <span className="text-xs font-mono text-secondary-main">Step {step} of 5</span>
                </div>
                
                <div className="w-full bg-primary-dark/50 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-secondary-main h-2.5 rounded-full"
                    style={{ width: `${Math.min((Number(step) / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-text-primary font-primary">{getStepDescription(step)}</p>
              </div>
              
              <div className="cyber-line w-full my-2"></div>
              
              <p className="text-sm text-text-secondary font-primary">
                Please wait and confirm all transactions in your wallet. Do not close this page.
              </p>
            </div>
          ) : (
            <Transaction
              onStatus={(status) => {
                console.log('Transaction status:', status);
              }}
              onSuccess={() => {
                console.log('Transaction successful');
                // We'll still use our custom deployment service
                deployContracts();
              }}
              onError={(error) => {
                console.error('Transaction error:', error);
              }}
            >
              <div className="space-y-4">
                <div className="p-4 bg-secondary-main/10 rounded-md text-text-primary font-primary">
                  <p>
                    This will deploy the following contracts to the Sepolia network:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Campaign Factory Contract</li>
                    <li>NFT Contract for campaign ownership</li>
                    <li>Sample Campaign for testing</li>
                  </ul>
                </div>
                
                <TransactionButton 
                  text="Deploy Contracts"
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
              </div>
            </Transaction>
          )}
        </div>
      )}
    </div>
  );
}
