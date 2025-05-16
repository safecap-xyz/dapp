import { useState, useEffect } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { useUserOp } from '../web3/services/UserOpService'
import { NetworkSwitcher } from './NetworkSwitcher'
import { Typography } from './ui'
import config from '../config'

interface SmartAccount {
  smartAccountAddress: string;
  ownerAddress: string;
  network: string;
}

export function SmartAccountDeployer() {
  const { isConnected, address } = useWallet()

  // State for selected smart account
  const [smartAccounts, setSmartAccounts] = useState<SmartAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<SmartAccount | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Campaign form state
  const [campaignName, setCampaignName] = useState('')
  const [fundingGoal, setFundingGoal] = useState('1.0')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignDuration, setCampaignDuration] = useState('30')

  // Use our UserOp service
  const userOp = useUserOp()

  // Fetch smart accounts when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchSmartAccounts()
    }
  }, [isConnected, address])

  const fetchSmartAccounts = async () => {
    if (!address) return

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${config.apiBaseUrl}/api/smart-accounts?ownerAddress=${address}`)

      if (!response.ok) {
        throw new Error('Failed to fetch smart accounts')
      }

      const data = await response.json()

      if (data.smartAccounts && data.smartAccounts.length > 0) {
        setSmartAccounts(data.smartAccounts)
        setSelectedAccount(data.smartAccounts[0])
      } else {
        setError('No smart accounts found for this address')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching smart accounts'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
          network: 'base-sepolia'
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

  const deployContracts = async () => {
    if (!selectedAccount || !address) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const campaignDetails = {
        name: campaignName,
        description: campaignDescription,
        goal: fundingGoal,
        duration: campaignDuration
      }

      // Deploy contracts via user operation
      const result = await userOp.deployContractsViaUserOp(
        selectedAccount.smartAccountAddress as `0x${string}`,
        address as `0x${string}`,
        'base-sepolia',
        campaignDetails
      )

      setSuccess(`Contract deployment initiated! UserOpHash: ${result.userOpHash}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deploying contracts'
      setError(errorMessage)
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

      {isConnected && <NetworkSwitcher />}

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
                onClick={createNewSmartAccount}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Smart Account'}
              </button>
            </div>
          )}
        </div>

        {/* Campaign Details Section */}
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

            <div className="pt-4">
              <button
                onClick={deployContracts}
                className="w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
                disabled={loading || !campaignName || !fundingGoal || !campaignDescription || !campaignDuration}
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
          </div>
        )}

        {userOp.userOpHash && (
          <div className="mt-4 p-3 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
            <p className="text-text-primary mb-2"><span className="font-medium">UserOp Hash:</span> {userOp.userOpHash}</p>
            <a
              href={`https://basescan.org/tx/${userOp.transactionHash || userOp.userOpHash}`}
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

export default SmartAccountDeployer
