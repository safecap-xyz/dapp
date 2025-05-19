import { useState, useEffect } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { useUserOp } from '../web3/services/UserOpService'
import config, { CHAINS, ChainType } from '../config'
import { type Address } from 'viem'
import { CampaignDetails } from '../types'
import { Typography } from './ui'

interface SmartAccount {
  smartAccountAddress: string;
  ownerAddress: string;
  network: ChainType;
}



// CampaignDetails is now imported from types

export function SmartAccountDeployer() {
  const { isConnected, address } = useWallet()
  const userOp = useUserOp()
  const { userOpHash, transactionHash } = userOp

  // State for selected smart account
  const [selectedNetwork, setSelectedNetwork] = useState<ChainType>('base')
  const [selectedAccount, setSelectedAccount] = useState<SmartAccount | null>(null)
  const [smartAccounts, setSmartAccounts] = useState<SmartAccount[]>([])
  const [campaignName, setCampaignName] = useState('')
  const [campaignGoal, setCampaignGoal] = useState('1.0')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignDuration, setCampaignDuration] = useState('30')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch smart accounts when connected
  const fetchSmartAccounts = async (address: string) => {
    if (!address) return

    try {
      setError('')
      const response = await fetch(`${config.apiBaseUrl}/smart-accounts/${address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch smart accounts')
      }
      const accounts = await response.json()
      setSmartAccounts(accounts)
    } catch (error) {
      console.error('Error fetching smart accounts:', error)
      setError('Failed to fetch smart accounts')
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchSmartAccounts(address)
    }
  }, [isConnected, address])

  const createNewSmartAccount = async () => {
    if (!address) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch(`${config.apiBaseUrl}/api/create-smart-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerAddress: address,
          network: selectedNetwork
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create smart account')
      }

      const data = await response.json()
      setSuccess(`Smart account created successfully! Address: ${data.smartAccountAddress}`)

      // Add the new account to the list and select it
      const newAccount = {
        smartAccountAddress: data.smartAccountAddress,
        ownerAddress: data.ownerAddress,
        network: data.network
      }

      setSmartAccounts([...smartAccounts, newAccount])
      setSelectedAccount(newAccount)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the smart account'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeployCampaign = async () => {
    if (!selectedAccount || !address) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const campaignDetails: CampaignDetails = {
        name: campaignName,
        goal: (parseFloat(campaignGoal) * 1e18).toString(), // Convert to wei and string
        description: campaignDescription,
        duration: parseInt(campaignDuration, 10) * 24 * 60 * 60 // Convert days to seconds
      }

      const response = await userOp.deployCampaign(
        selectedAccount.smartAccountAddress as Address,
        address,
        campaignDetails,
        selectedNetwork
      )

      if (response.userOpHash) {
        setSuccess('Contracts deployed successfully!')
      } else {
        setError('Failed to deploy contracts')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      console.error('Deployment error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-primary-dark/30 rounded-lg text-center border border-secondary-main/30">
        <p className="text-secondary-light font-primary">Please connect your wallet to use smart accounts</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
      <h2 className="text-xl font-bold text-text-primary mb-4 font-secondary">Deploy with Smart Account</h2>

      {isConnected && (
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium">Network:</span>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value as ChainType)}
            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Object.entries(CHAINS).map(([key, chain]) => (
              <option key={key} value={key}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {/* Smart Account Section */}
        <div className="space-y-4">
          <Typography variant="h3" className="mb-2">Smart Account</Typography>
          <div className="cyber-line w-full my-3"></div>

          {smartAccounts.length > 0 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary font-primary mb-2">Select Smart Account</label>
                <select
                  className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
                  value={selectedAccount?.smartAccountAddress || ''}
                  onChange={(e) => {
                    const selected = smartAccounts.find(acc => acc.smartAccountAddress === e.target.value)
                    setSelectedAccount(selected || null)
                  }}
                >
                  {smartAccounts.map((account) => (
                    <option key={account.smartAccountAddress} value={account.smartAccountAddress}>
                      {account.smartAccountAddress}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAccount && (
                <div className="p-3 bg-primary-dark/30 rounded border border-secondary-main/30">
                  <p className="text-text-primary"><span className="font-medium">Smart Account:</span> {selectedAccount.smartAccountAddress}</p>
                  <p className="text-text-primary"><span className="font-medium">Owner:</span> {selectedAccount.ownerAddress}</p>
                  <p className="text-text-primary"><span className="font-medium">Network:</span> {selectedAccount.network}</p>
                </div>
              )}

              <button
                onClick={createNewSmartAccount}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-primary-dark text-text-primary hover:bg-primary-light border border-secondary-main/30"
              >
                {loading ? 'Creating...' : 'Create Another Smart Account'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-text-primary">You don't have any smart accounts yet. Create one to get started.</p>
              <button
                onClick={handleDeployCampaign}
                disabled={!selectedAccount || loading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Deploying...' : 'Deploy Campaign'}
              </button>
            </div>
          )}
        </div>

// ... (rest of the code remains the same)
        {selectedAccount && (
          <div className="space-y-4">
            <Typography variant="h3" className="mb-2">Campaign Details</Typography>
            <div className="cyber-line w-full my-3"></div>

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
                type="number"
                min="0"
                step="0.01"
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
                placeholder="1.0"
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

            <div className="pt-4">
              <button
                disabled={loading || !campaignName || !campaignGoal || !campaignDescription || !campaignDuration}
                className="w-full py-2 px-4 bg-primary-main hover:bg-primary-dark text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={deployContracts}
              >
                {loading ? 'Deploying...' : 'Deploy Contracts via Smart Account'}
              </button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-error-main/20 rounded-lg border border-error-main/30">
            <p className="text-error-main">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-success-main/20 rounded-lg border border-success-main/30">
            <p className="text-success-main">{success}</p>
            <div className="mt-4">
              <p className="text-text-primary mb-2"><span className="font-medium">UserOp Hash:</span> {userOpHash}</p>
              <a href={`https://basescan.org/tx/${transactionHash || userOpHash}`} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-primary hover:underline">
                View on BaseScan
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartAccountDeployer
