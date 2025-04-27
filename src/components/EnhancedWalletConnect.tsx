import { useAccount } from 'wagmi';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';

export function EnhancedWalletConnect() {
  const { address, isConnected } = useAccount();
  
  return (
    <div className="relative">
      <Wallet>
        {isConnected ? (
          <div className="flex items-center space-x-2">
            <ConnectWallet className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light">
              <div className="flex items-center space-x-2">
                <Avatar address={address} className="h-6 w-6" />
                <Name address={address} className="font-primary text-sm" />
              </div>
            </ConnectWallet>
            
            <WalletDropdown className="glass-panel border border-secondary-main/30">
              <Identity address={address} className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <div className="flex flex-col items-center space-y-2 mb-2">
                  <Avatar address={address} className="h-12 w-12" />
                  <Name address={address} className="font-primary text-lg glow-text" />
                  <Address address={address} className="font-mono text-xs text-text-secondary" />
                  <div className="cyber-line w-full my-2"></div>
                </div>
              </Identity>
              <div className="cyber-line w-full my-2 mx-auto"></div>
              <WalletDropdownDisconnect className="text-error-main hover:text-error-main/80" />
            </WalletDropdown>
          </div>
        ) : (
          <ConnectWallet className="px-4 py-2 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light">
            Connect Wallet
          </ConnectWallet>
        )}
      </Wallet>
    </div>
  );
}
