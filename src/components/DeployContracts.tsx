import { useState } from 'react'
import { useContractDeployment, DeploymentStep } from '../web3/services/DeploymentService'
import { useWallet } from '../web3/hooks/useWallet'
import { NetworkSwitcher } from './NetworkSwitcher'

export function DeployContracts() {
  const { isConnected, address, isSepoliaNetwork } = useWallet()
  
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
      <div className="my-4 p-6 border rounded-lg shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Deploy Contracts</h2>
        <p className="mb-4">Please connect your wallet to deploy contracts.</p>
      </div>
    )
  }

  return (
    <div className="my-4 p-6 border rounded-lg shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Deploy Contracts on Sepolia Testnet</h2>
      
      {isConnected && <NetworkSwitcher />}

      {!isDeploying && !isSuccess && !isError && (
        <div>
          <p className="mb-4">Deploy the SafeCap contracts to Sepolia testnet.</p>
          <p className="mb-4 text-sm text-gray-600">
            This will deploy three contracts: a CampaignFactory, a CampaignNFT,
            and a sample Campaign. The process requires multiple transactions and
            can take a few minutes to complete.
          </p>
          <button
            onClick={deployContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isDeploying || !isSepoliaNetwork}
          >
            Deploy Contracts
          </button>
          {!isSepoliaNetwork && (
            <p className="mt-2 text-sm text-orange-600">
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
            <h3 className="font-medium mb-2">Deployment Progress:</h3>
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

          <p className="text-sm text-gray-600">Please keep this window open and approve all transaction requests in your wallet.</p>
        </div>
      )}

      {isSuccess && (
        <div>
          <div className="flex items-center mb-4 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold">Deployment Successful on Sepolia Testnet!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-medium mb-1">Campaign Factory Contract:</h3>
              <div className="flex items-center">
                <code className="bg-gray-100 p-2 rounded text-sm flex-grow overflow-x-auto">{factoryAddress}</code>
                <button
                  onClick={() => copyToClipboard(factoryAddress || '', 'factory')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {copied['factory'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Campaign NFT Contract:</h3>
              <div className="flex items-center">
                <code className="bg-gray-100 p-2 rounded text-sm flex-grow overflow-x-auto">{nftAddress}</code>
                <button
                  onClick={() => copyToClipboard(nftAddress || '', 'nft')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {copied['nft'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Sample Campaign Contract:</h3>
              <div className="flex items-center">
                <code className="bg-gray-100 p-2 rounded text-sm flex-grow overflow-x-auto">{sampleCampaignAddress || 'Not available'}</code>
                {sampleCampaignAddress && (
                  <button
                    onClick={() => copyToClipboard(sampleCampaignAddress || '', 'campaign')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {copied['campaign'] ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p className="mb-2">Next Steps:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Save these contract addresses for future reference</li>
              <li>Verify contracts on the Sepolia block explorer (optional)</li>
              <li>Configure your frontend to use these contract addresses</li>
            </ol>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            Deploy Again
          </button>
        </div>
      )}

      {isError && (
        <div>
          <div className="flex items-center mb-4 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">Deployment Failed</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-700">{error?.message || 'Unknown error occurred during deployment'}</p>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DeployContracts