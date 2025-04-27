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
      <div className="my-4 p-6 border rounded-lg shadow-md bg-neutral-light">
        <h2 className="text-xl font-secondary font-semibold mb-4 text-primary-dark">Deploy Contracts</h2>
        <p className="mb-4 font-primary text-text-secondary">Please connect your wallet to deploy contracts.</p>
      </div>
    )
  }

  return (
    <div className="my-4 p-6 border rounded-lg shadow-md bg-neutral-light">
      <h2 className="text-xl font-secondary font-semibold mb-4 text-primary-dark">Deploy Contracts on Sepolia Testnet</h2>
      
      {isConnected && <NetworkSwitcher />}

      {!isDeploying && !isSuccess && !isError && (
        <div>
          <p className="mb-4 font-primary text-text-primary">Deploy the SafeCap contracts to Sepolia testnet.</p>
          <p className="mb-4 text-sm text-text-secondary font-primary">
            This will deploy three contracts: a CampaignFactory, a CampaignNFT,
            and a sample Campaign. The process requires multiple transactions and
            can take a few minutes to complete.
          </p>
          <button
            onClick={deployContracts}
            className="px-4 py-2 bg-secondary-main text-secondary-contrast rounded font-primary font-medium hover:bg-secondary-dark transition-colors"
            disabled={isDeploying || !isSepoliaNetwork}
          >
            Deploy Contracts
          </button>
          {!isSepoliaNetwork && (
            <p className="mt-2 text-sm text-warning-main font-primary">
              Please switch to the Sepolia network using the network switcher above before deploying.
            </p>
          )}
        </div>
      )}

      {isDeploying && (
        <div>
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary-main mr-3"></div>
            <p className="font-primary text-text-primary">{getStepDescription(step)}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2 font-secondary text-primary-dark">Deployment Progress:</h3>
            <div className="space-y-2">
              <div className={`flex items-center font-primary ${step === DeploymentStep.DeployingTempFactory || step > DeploymentStep.DeployingTempFactory ? 'text-secondary-main' : 'text-text-secondary'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingTempFactory ? 'bg-success-main/20 text-success-main' : 'bg-secondary-main/20'}`}>
                  {step > DeploymentStep.DeployingTempFactory ? '✓' : '1'}
                </div>
                <span>Deploying temporary factory</span>
              </div>

              <div className={`flex items-center font-primary ${step === DeploymentStep.DeployingNFT || step > DeploymentStep.DeployingNFT ? 'text-secondary-main' : 'text-text-secondary'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingNFT ? 'bg-success-main/20 text-success-main' : 'bg-secondary-main/20'}`}>
                  {step > DeploymentStep.DeployingNFT ? '✓' : '2'}
                </div>
                <span>Deploying NFT contract</span>
              </div>

              <div className={`flex items-center font-primary ${step === DeploymentStep.DeployingFinalFactory || step > DeploymentStep.DeployingFinalFactory ? 'text-secondary-main' : 'text-text-secondary'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.DeployingFinalFactory ? 'bg-success-main/20 text-success-main' : 'bg-secondary-main/20'}`}>
                  {step > DeploymentStep.DeployingFinalFactory ? '✓' : '3'}
                </div>
                <span>Deploying final factory</span>
              </div>

              <div className={`flex items-center font-primary ${step === DeploymentStep.UpdatingNFT || step > DeploymentStep.UpdatingNFT ? 'text-secondary-main' : 'text-text-secondary'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.UpdatingNFT ? 'bg-success-main/20 text-success-main' : 'bg-secondary-main/20'}`}>
                  {step > DeploymentStep.UpdatingNFT ? '✓' : '4'}
                </div>
                <span>Updating NFT contract</span>
              </div>

              <div className={`flex items-center font-primary ${step === DeploymentStep.CreatingSampleCampaign || step > DeploymentStep.CreatingSampleCampaign ? 'text-secondary-main' : 'text-text-secondary'}`}>
                <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step > DeploymentStep.CreatingSampleCampaign ? 'bg-success-main/20 text-success-main' : 'bg-secondary-main/20'}`}>
                  {step > DeploymentStep.CreatingSampleCampaign ? '✓' : '5'}
                </div>
                <span>Creating sample campaign</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-text-secondary font-primary">Please keep this window open and approve all transaction requests in your wallet.</p>
        </div>
      )}

      {isSuccess && (
        <div>
          <div className="flex items-center mb-4 text-success-main">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold font-primary">Deployment Successful on Sepolia Testnet!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-medium mb-1 font-secondary text-primary-dark">Campaign Factory Contract:</h3>
              <div className="flex items-center">
                <code className="bg-neutral-dark p-2 rounded text-sm flex-grow overflow-x-auto font-mono text-text-primary">{factoryAddress}</code>
                <button
                  onClick={() => copyToClipboard(factoryAddress || '', 'factory')}
                  className="ml-2 text-secondary-main hover:text-secondary-dark font-primary"
                >
                  {copied['factory'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1 font-secondary text-primary-dark">Campaign NFT Contract:</h3>
              <div className="flex items-center">
                <code className="bg-neutral-dark p-2 rounded text-sm flex-grow overflow-x-auto font-mono text-text-primary">{nftAddress}</code>
                <button
                  onClick={() => copyToClipboard(nftAddress || '', 'nft')}
                  className="ml-2 text-secondary-main hover:text-secondary-dark font-primary"
                >
                  {copied['nft'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1 font-secondary text-primary-dark">Sample Campaign Contract:</h3>
              <div className="flex items-center">
                <code className="bg-neutral-dark p-2 rounded text-sm flex-grow overflow-x-auto font-mono text-text-primary">{sampleCampaignAddress || 'Not available'}</code>
                {sampleCampaignAddress && (
                  <button
                    onClick={() => copyToClipboard(sampleCampaignAddress || '', 'campaign')}
                    className="ml-2 text-secondary-main hover:text-secondary-dark font-primary"
                  >
                    {copied['campaign'] ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-text-secondary mb-4 font-primary">
            <p className="mb-2 font-medium">Next Steps:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Save these contract addresses for future reference</li>
              <li>Verify contracts on the Sepolia block explorer (optional)</li>
              <li>Configure your frontend to use these contract addresses</li>
            </ol>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 border border-secondary-main text-secondary-main rounded font-primary font-medium hover:bg-secondary-main/10 transition-colors"
          >
            Deploy Again
          </button>
        </div>
      )}

      {isError && (
        <div>
          <div className="flex items-center mb-4 text-error-main">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold font-primary">Deployment Failed</p>
          </div>

          <div className="bg-error-main/10 border border-error-main/20 rounded p-3 mb-4">
            <p className="text-error-main font-primary">{error?.message || error?.toString() || 'Unknown error occurred during deployment'}</p>
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

export default DeployContracts