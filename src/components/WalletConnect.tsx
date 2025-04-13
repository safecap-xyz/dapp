import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask, injected } from 'wagmi/connectors'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, pendingConnector, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  // Check for MetaMask and other wallet providers
  useEffect(() => {
    const checkProviders = () => {
      // Check window.ethereum
      const ethereum = window.ethereum;
      console.log('window.ethereum:', ethereum);

      // Check if MetaMask is available
      const isMetaMaskAvailable = ethereum?.isMetaMask || false;
      console.log('MetaMask available:', isMetaMaskAvailable);

      // Check for providers array (used when multiple wallets are installed)
      const providers = ethereum?.providers;
      console.log('Providers array:', providers);

      if (isMetaMaskAvailable) {
        setHasMetaMask(true);
      } else if (providers) {
        // Find MetaMask in providers array
        const metaMaskProvider = providers.find((p: any) => p.isMetaMask);
        setHasMetaMask(!!metaMaskProvider);
        console.log('MetaMask in providers array:', !!metaMaskProvider);
      }
    };

    checkProviders();
  }, []);

  // Clear error message when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setErrorMessage(null)
    }
  }, [isModalOpen])

  // Handle connection errors
  useEffect(() => {
    if (error) {
      console.error('Wallet connection error:', error)
      setErrorMessage(error.message || 'Failed to connect wallet. Please try again.')
    }
  }, [error])

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm text-white">
          Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
        >
          Disconnect
        </button>
      </div>
    )
  }

  const handleConnect = async (connector: any) => {
    try {
      console.log(`Attempting to connect with ${connector.name} (${connector.id})`);
      console.log('Connector details:', connector);

      setErrorMessage(null);

      // Log provider state before connection attempt
      if (connector.id === 'metaMask') {
        console.log('MetaMask provider state:', window.ethereum);
        console.log('MetaMask installed:', window.ethereum?.isMetaMask);

        // Check if MetaMask is locked
        try {
          const accounts = await window.ethereum?.request?.({ method: 'eth_accounts' });
          console.log('Current accounts:', accounts);
          if (accounts && accounts.length === 0) {
            console.log('MetaMask is locked or no accounts available');
          }
        } catch (e) {
          console.error('Error checking MetaMask accounts:', e);
        }
      }

      // Attempt connection
      const result = await connect({ connector });
      console.log('Connection result:', result);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Connection error:', err);
      // Log detailed error information
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack,
        cause: err.cause,
        name: err.name
      });

      // Set a more descriptive error message
      let errorMsg = err.message || 'Failed to connect wallet. Please try again.';

      // Add specific error handling for common issues
      if (err.message?.includes('already processing')) {
        errorMsg = 'There is already a pending wallet connection request. Please check your wallet.';
      } else if (err.message?.includes('rejected')) {
        errorMsg = 'Connection request was rejected. Please try again and approve the connection in your wallet.';
      } else if (err.message?.includes('user rejected')) {
        errorMsg = 'You rejected the connection request. Please try again and approve the connection.';
      }

      setErrorMessage(errorMsg);
    }
  }

  // Create a direct MetaMask connector instance
  const handleMetaMaskConnect = async () => {
    try {
      const metaMaskConnector = metaMask();
      console.log('Using direct MetaMask connector:', metaMaskConnector);
      await connect({ connector: metaMaskConnector });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('MetaMask connection error:', err);
      setErrorMessage(err.message || 'Failed to connect to MetaMask');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
      >
        Connect Wallet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              {/* Always add MetaMask button if available */}
              {hasMetaMask && (
                <button
                  onClick={handleMetaMaskConnect}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                  MetaMask
                </button>
              )}

              {/* Display other available connectors */}
              {connectors.map((connector) => {
                // Skip showing MetaMask since we have a dedicated button
                if (connector.id === 'metaMask') {
                  return null;
                }

                // Always enable WalletConnect and CoinbaseWallet
                let isReady = connector.ready;
                if (connector.id === 'walletConnect' || connector.id === 'coinbaseWallet') {
                  isReady = true;
                }

                console.log(`Connector: ${connector.name} (${connector.id}), Ready: ${isReady}, UID: ${connector.uid}`);

                return (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={!isReady || isPending}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {connector.name}
                    {!isReady && ' (unsupported)'}
                    {isPending && connector.uid === pendingConnector?.uid && ' (connecting...)'}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              {!window.ethereum && (
                <p className="mt-2">
                  No wallet detected! Install{' '}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    MetaMask
                  </a>{' '}
                  or another compatible wallet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}