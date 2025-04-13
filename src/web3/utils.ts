/**
 * Utilities for Ethereum wallet interactions
 */

/**
 * Formats an Ethereum address for display by shortening it
 * @param address - The full Ethereum address
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Shortened address string with ellipsis in the middle
 */
export function formatAddress(address?: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  
  if (address.length <= startLength + endLength) {
    return address;
  }
  
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

/**
 * Formats an amount of Ether with proper decimal places
 * @param amount - The amount in wei as a string or number
 * @param decimals - Number of decimal places to display (default: 4)
 * @returns Formatted string representation
 */
export function formatEther(amount?: string | number, decimals = 4): string {
  if (amount === undefined) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = numAmount.toFixed(decimals);
  
  // Remove trailing zeros
  return formatted.replace(/\.?0+$/, '');
}

/**
 * Adds ETH network to MetaMask if not already added
 * @param chainId - The chain ID to add
 * @param chainName - The name of the chain
 * @param rpcUrl - The RPC URL for the chain
 */
export async function addEthereumChain(
  chainId: number,
  chainName: string,
  rpcUrl: string,
  blockExplorerUrl?: string
): Promise<void> {
  try {
    // Check if window.ethereum is available
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName,
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: blockExplorerUrl ? [blockExplorerUrl] : undefined,
        },
      ],
    });
  } catch (error) {
    console.error('Error adding Ethereum chain:', error);
    throw error;
  }
}

// Add Ethereum provider type definitions
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}
