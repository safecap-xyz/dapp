import { useState } from 'react'
import { useContractDeployment, DeploymentStep } from '../web3/services/DeploymentService'
import { useWallet } from '../web3/hooks/useWallet'
import { NetworkSwitcher } from './NetworkSwitcher'

export function DeployContracts() {
  const { isConnected, isBaseSepoliaNetwork } = useWallet()
  
  const {
    isDeploying,
    isSuccess,
    isError,
    factoryAddress,
    nftAddress,
    campaignAddress,
    error,
    step,
    deployContracts,
    reset
  } = useContractDeployment()

  // Campaign form state
  const [showForm, setShowForm] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [fundingGoal, setFundingGoal] = useState('1.0')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignDuration, setCampaignDuration] = useState('30')

  const [copied, setCopied] = useState<{[key: string]: boolean}>({})

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({...copied, [key]: true})
    setTimeout(() => {
      setCopied({...copied, [key]: false})
    }, 2000)
  }

  const getStepDescription = (currentStep: DeploymentStep) => {
    switch(currentStep) {
      case DeploymentStep.DeployingTempFactory:
        return 'Deploying temporary factory contract...'
      case DeploymentStep.DeployingNFT:
        return 'Deploying NFT contract...'
      case DeploymentStep.DeployingFinalFactory:
        return 'Deploying final factory contract...'
      case DeploymentStep.UpdatingNFT:
        return 'Updating NFT contract to point to final factory...'
      case DeploymentStep.CreatingCampaign:
        return 'Creating your campaign...'
      case DeploymentStep.Completed:
        return 'Deployment completed successfully!'
      default:
        return 'Ready to deploy contracts'
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center border border-secondary-main/30">
        <p className="text-secondary-light font-primary">Please connect your wallet to deploy contracts</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
      <h2 className="text-xl font-bold text-text-primary mb-4 font-secondary">Deploy Contracts on Base Sepolia Testnet</h2>
      
      {isConnected && <NetworkSwitcher />}

      {!isDeploying && !isSuccess && !isError && (
        <div>
          {!showForm ? (
            <div>
              <p className="text-text-primary mb-4">Create a new fundraising campaign on the blockchain.</p>
              <p className="text-sm text-secondary-light mb-4">
                This will deploy your campaign to the blockchain, allowing others to contribute funds.
                The process requires multiple transactions and can take a few minutes to complete.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
                disabled={!isBaseSepoliaNetwork}
              >
                Create New Campaign
              </button>
              {!isBaseSepoliaNetwork && (
                <p className="mt-2 text-sm text-error-main">
                  Please switch to the Base Sepolia network using the network switcher above before creating a campaign.
                </p>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4 font-secondary">Campaign Details</h3>
              <div className="space-y-4">
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
                    onClick={() => setShowForm(false)}
                    className="px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-dark text-text-primary hover:bg-primary-light border border-secondary-main/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Pass the form data to deployContracts
                      deployContracts({
                        name: campaignName,
                        description: campaignDescription,
                        goal: fundingGoal,
                        duration: campaignDuration
                      });
                    }}
                    className="flex-1 px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
                    disabled={!campaignName || !fundingGoal || !campaignDescription || !campaignDuration}
                  >
                    Create Campaign
                  </button>
                </div>
                <p className="text-xs text-text-secondary mt-2 text-center">
                  All campaign details will be stored on-chain for transparency and accessibility.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isDeploying && (
        <div>
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
            <p>{getStepDescription(step)}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2 text-text-primary">Deployment Progress:</h3>
            <div className="space-y-2">
              <div className={`flex items-center ${step === DeploymentStep.DeployingTempFactory || step > DeploymentStep.DeployingTempFactory ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingTempFactory ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.DeployingTempFactory ? '✓' : '1'}
                </div>
                <span>Deploying temporary factory</span>
              </div>

              <div className={`flex items-center ${step === DeploymentStep.DeployingNFT || step > DeploymentStep.DeployingNFT ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingNFT ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.DeployingNFT ? '✓' : '2'}
                </div>
                <span>Deploying NFT contract</span>
              </div>

              <div className={`flex items-center ${step === DeploymentStep.DeployingFinalFactory || step > DeploymentStep.DeployingFinalFactory ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingFinalFactory ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.DeployingFinalFactory ? '✓' : '3'}
                </div>
                <span>Deploying final factory</span>
              </div>

              <div className={`flex items-center ${step === DeploymentStep.UpdatingNFT || step > DeploymentStep.UpdatingNFT ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.UpdatingNFT ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.UpdatingNFT ? '✓' : '4'}
                </div>
                <span>Updating NFT contract</span>
              </div>

              <div className={`flex items-center ${step === DeploymentStep.CreatingCampaign || step > DeploymentStep.CreatingCampaign ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.CreatingCampaign ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.CreatingCampaign ? '✓' : '5'}
                </div>
                <span>Creating campaign</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-secondary-light">Please keep this window open and approve all transaction requests in your wallet.</p>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-success-main/20 rounded-lg border border-success-main/30">
          <h3 className="text-xl font-bold text-success-main mb-4 font-secondary">Campaign Created Successfully!</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium font-primary text-text-primary">Factory Contract:</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 text-secondary-light">{factoryAddress}</span>
                  <button 
                    onClick={() => copyToClipboard(factoryAddress || '', 'factory')}
                    className="text-secondary-main hover:text-secondary-light transition-colors"
                  >
                    {copied['factory'] ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium font-primary text-text-primary">NFT Contract:</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 text-secondary-light">{nftAddress}</span>
                  <button 
                    onClick={() => copyToClipboard(nftAddress || '', 'nft')}
                    className="text-secondary-main hover:text-secondary-light transition-colors"
                  >
                    {copied['nft'] ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium font-primary text-text-primary">Campaign Contract:</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 text-secondary-light">{campaignAddress}</span>
                  <button 
                    onClick={() => copyToClipboard(campaignAddress || '', 'campaign')}
                    className="text-secondary-main hover:text-secondary-light transition-colors"
                  >
                    {copied['campaign'] ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30">
              <h4 className="font-medium font-primary text-text-primary mb-2">Campaign Details</h4>
              <div className="space-y-2 text-sm text-secondary-light">
                <p><span className="text-text-primary">Name:</span> {campaignName}</p>
                <p><span className="text-text-primary">Goal:</span> {fundingGoal} ETH</p>
                <p><span className="text-text-primary">Duration:</span> {campaignDuration} days</p>
                <div>
                  <p className="text-text-primary mb-1">Description:</p>
                  <p className="text-xs">{campaignDescription}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={reset}
                className="flex-1 px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
              >
                Create Another Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-error-main/20 rounded-lg border border-error-main/30">
          <h3 className="text-xl font-bold text-error-main mb-4 font-secondary">Deployment Failed</h3>
          <p className="text-error-main mb-4 font-primary">{error?.message || 'An error occurred during deployment'}</p>
          
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DeployContracts