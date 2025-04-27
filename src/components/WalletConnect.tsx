import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)
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
        <div className="text-sm text-white font-primary">
          Connected: <span className="text-secondary-light font-mono">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 text-xs font-medium rounded font-primary transition-colors focus:outline-none bg-error-main text-white hover:bg-opacity-80"
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
      setPendingConnectorId(connector.id);

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
    } finally {
      setPendingConnectorId(null);
    }
  }

  // Create a direct MetaMask connector instance
  const handleMetaMaskConnect = async () => {
    try {
      const metaMaskConnector = metaMask();
      console.log('Using direct MetaMask connector:', metaMaskConnector);
      setPendingConnectorId('metaMask');
      await connect({ connector: metaMaskConnector });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('MetaMask connection error:', err);
      setErrorMessage(err.message || 'Failed to connect to MetaMask');
    } finally {
      setPendingConnectorId(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
      >
        Connect Wallet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="p-6 glass-panel rounded-lg shadow-neon border border-secondary-main/30 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-secondary font-bold text-text-primary glow-text">Connect Wallet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-accent-main hover:text-accent-light transition-colors"
              >
                ×
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-error-main/20 border border-error-main/30 text-error-main rounded-md text-sm font-primary">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              {/* Always add MetaMask button if available */}
              {hasMetaMask && (
                <button
                  onClick={handleMetaMaskConnect}
                  className="w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon mb-2 flex items-center justify-center"
                >
                  <span className="mr-2">🦊</span> MetaMask
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
                    disabled={!isReady || isPending}
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    className={`w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none mb-2 flex items-center justify-center ${!isReady ? 'bg-primary-dark/50 text-text-disabled cursor-not-allowed' : isPending && pendingConnectorId === connector.id ? 'bg-secondary-main/50 text-secondary-contrast/70' : 'bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon'}`}
                  >
                    {connector.id === 'walletConnect' && <span className="mr-2">🔗</span>}
                    {connector.id === 'coinbaseWallet' && <span className="mr-2">🪙</span>}
                    {connector.name}
                    {!isReady && ' (unsupported)'}
                    {isPending && pendingConnectorId === connector.id && ' (connecting...)'}
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