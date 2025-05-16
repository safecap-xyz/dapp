import { useState } from 'react'
import { useWallet } from '../web3/hooks/useWallet'
import { NetworkSwitcher } from './NetworkSwitcher'
import { Typography } from './ui'
import config from '../config'

export function SmartAccountTester() {
  const { isConnected, address } = useWallet()

  const [smartAccountAddress, setSmartAccountAddress] = useState('')
  const [targetAddress, setTargetAddress] = useState('0x0000000000000000000000000000000000000000')
  const [callData, setCallData] = useState('0x')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userOpHash, setUserOpHash] = useState('')

  // Fetch smart accounts when connected
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
        setSmartAccountAddress(data.smartAccounts[0].smartAccountAddress)
      } else {
        setError('No smart accounts found. Please create one first.')
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
      setSmartAccountAddress(data.smartAccountAddress)
      setSuccess(`Smart account created successfully! Address: ${data.smartAccountAddress}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the smart account'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sendUserOp = async () => {
    if (!smartAccountAddress) {
      setError('Please enter a smart account address')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      setUserOpHash('')

      console.log('Sending UserOp with data:', {
        smartAccountAddress,
        targetAddress,
        callData
      })

      const response = await fetch(`${config.apiBaseUrl}/api/send-user-operation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smartAccountAddress,
          network: 'base-sepolia',
          calls: [{
            to: targetAddress,
            value: '0',
            data: callData
          }]
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send user operation')
      }

      const data = await response.json()
      console.log('UserOp Response:', data)

      setUserOpHash(data.userOpHash)
      setSuccess('User operation sent successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while sending user operation'
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
      <h2 className="text-xl font-bold text-text-primary mb-4 font-secondary">Smart Account Tester</h2>

      {isConnected && <NetworkSwitcher />}

      <div className="mt-6 space-y-6">
        <div className="space-y-4">
          <Typography variant="h3" className="mb-2">Smart Account</Typography>
          <div className="cyber-line w-full my-3"></div>

          <div className="flex space-x-2">
            <button
              onClick={fetchSmartAccounts}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
            >
              Fetch Smart Accounts
            </button>

            <button
              onClick={createNewSmartAccount}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
            >
              Create New Smart Account
            </button>
          </div>

          <div>
            <label className="block text-text-primary font-primary mb-2">Smart Account Address</label>
            <input
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
              placeholder="Enter smart account address"
              type="text"
              value={smartAccountAddress}
              onChange={(e) => setSmartAccountAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Typography variant="h3" className="mb-2">User Operation</Typography>
          <div className="cyber-line w-full my-3"></div>

          <div>
            <label className="block text-text-primary font-primary mb-2">Target Address</label>
            <input
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
              placeholder="Enter target address (e.g., 0x...)"
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-text-primary font-primary mb-2">Call Data</label>
            <input
              className="w-full px-3 py-2 border border-secondary-main/30 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-main/50 bg-primary-dark/30 text-text-primary font-primary"
              placeholder="Enter call data (e.g., 0x...)"
              type="text"
              value={callData}
              onChange={(e) => setCallData(e.target.value)}
            />
          </div>

          <button
            onClick={sendUserOp}
            disabled={loading || !smartAccountAddress}
            className="w-full px-4 py-3 mt-4 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send User Operation'}
          </button>
        </div>

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

        {userOpHash && (
          <div className="mt-4 p-3 bg-primary-dark/30 rounded-lg border border-secondary-main/30">
            <p className="text-text-primary mb-2"><span className="font-medium">UserOp Hash:</span> {userOpHash}</p>
            <a
              href={`https://basescan.org/tx/${userOpHash}`}
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

export default SmartAccountTester
