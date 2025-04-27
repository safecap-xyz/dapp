import { useState } from 'react'
import { useContractDeployment, DeploymentStep } from '../web3/services/DeploymentService'
import { useWallet } from '../web3/hooks/useWallet'
import { NetworkSwitcher } from './NetworkSwitcher'

export function DeployContracts() {
  const { isConnected, isSepoliaNetwork } = useWallet()
  
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
  } = useContractDeployment()

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
      case DeploymentStep.CreatingSampleCampaign:
        return 'Creating a sample campaign...'
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
      <h2 className="text-xl font-bold text-text-primary mb-4 font-secondary">Deploy Contracts on Sepolia Testnet</h2>
      
      {isConnected && <NetworkSwitcher />}

      {!isDeploying && !isSuccess && !isError && (
        <div>
          <p className="text-text-primary mb-4">Deploy the SafeCap contracts to Sepolia testnet.</p>
          <p className="text-sm text-secondary-light mb-4">
            This will deploy three contracts: a CampaignFactory, a CampaignNFT,
            and a sample Campaign. The process requires multiple transactions and
            can take a few minutes to complete.
          </p>
          <button
            onClick={deployContracts}
            className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
            disabled={isDeploying || !isSepoliaNetwork}
          >
            Deploy Contracts
          </button>
          {!isSepoliaNetwork && (
            <p className="mt-2 text-sm text-error-main">
              Please switch to the Sepolia network using the network switcher above before deploying.
            </p>
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

              <div className={`flex items-center ${step === DeploymentStep.CreatingSampleCampaign || step > DeploymentStep.CreatingSampleCampaign ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.CreatingSampleCampaign ? 'bg-green-100 text-green-600' : 'bg-blue-100'}`}>
                  {step > DeploymentStep.CreatingSampleCampaign ? '✓' : '5'}
                </div>
                <span>Creating sample campaign</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-secondary-light">Please keep this window open and approve all transaction requests in your wallet.</p>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-success-main/20 rounded-lg border border-success-main/30">
          <h3 className="text-xl font-bold text-success-main mb-4 font-secondary">Deployment Successful!</h3>
          
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
                <span className="font-medium font-primary text-text-primary">Sample Campaign:</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 text-secondary-light">{sampleCampaignAddress}</span>
                  <button 
                    onClick={() => copyToClipboard(sampleCampaignAddress || '', 'campaign')}
                    className="text-secondary-main hover:text-secondary-light transition-colors"
                  >
                    {copied['campaign'] ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
            >
              Deploy Again
            </button>
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