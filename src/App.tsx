import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { EnhancedWalletConnect } from './components/EnhancedWalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { EnhancedDeployContracts } from './components/EnhancedDeployContracts'
import { DonateCampaign } from './components/DonateCampaign'
import { EnhancedDonateCampaign } from './components/EnhancedDonateCampaign'
import { EnhancedCreateCampaign } from './components/EnhancedCreateCampaign'

function App() {
  const [currentNav, setCurrentNav] = useState('home')
  // State to toggle between original and enhanced components
  const [useEnhancedComponents, setUseEnhancedComponents] = useState(true);
  
  const handleNavClick = (key: string) => {
    setCurrentNav(key);
  };

  return (
    <>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-primary-main h-16 text-white flex items-center justify-between px-4 shadow-neon">
          <div className="flex items-center">
            <div className="font-secondary font-bold text-2xl glow-text">SafeCap</div>
            <div className="ml-2 text-sm bg-accent-main text-accent-contrast px-2 py-0.5 rounded-full font-medium">Sepolia Testnet</div>
          </div>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6 font-primary font-medium">
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'home' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('home')}>
                  Home
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'create' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('create')}>
                  Create Campaign
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'donate' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('donate')}>
                  Donate
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'deploy' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('deploy')}>
                  Deploy
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'about' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('about')}>
                  About
                </li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setUseEnhancedComponents(!useEnhancedComponents)}
                className="px-3 py-1 text-xs font-medium rounded font-primary transition-colors focus:outline-none bg-accent-main text-accent-contrast hover:bg-accent-light"
              >
                {useEnhancedComponents ? 'Use Original UI' : 'Use Enhanced UI'}
              </button>
              {useEnhancedComponents ? <EnhancedWalletConnect /> : <WalletConnect />}
            </div>
          </div>
        </div>
        <div className="min-h-[120px] text-white text-center">

          <div className="bg-main">
            <div className='content-main min-h-[900px] p-6'>
              {currentNav === 'create' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Create a Campaign</h1>
                  <p className="mb-6 text-text-primary font-primary">Create your crowdfunding campaign without needing your own wallet. We'll create a managed wallet for you!</p>
                  
                  {/* Use our new EnhancedCreateCampaign component */}
                  {useEnhancedComponents ? (
                    <EnhancedCreateCampaign 
                      onSuccess={(address) => {
                        console.log('Campaign created with managed wallet:', address);
                        // In a real app, we would store this campaign in a database or contract
                      }}
                    />
                  ) : (
                    <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 max-w-2xl mx-auto">
                      <h2 className="text-xl font-secondary font-bold mb-4 text-text-primary">Enhanced UI Required</h2>
                      <div className="cyber-line w-full my-3"></div>
                      <p className="mb-4 text-text-primary font-primary">Managed wallets are only available when using the Enhanced UI with Coinbase Developer Platform.</p>
                      <button 
                        onClick={() => setUseEnhancedComponents(true)}
                        className="w-full px-4 py-3 text-sm font-medium rounded font-primary transition-colors focus:outline-none bg-secondary-main text-secondary-contrast hover:bg-secondary-light shadow-neon"
                      >
                        Switch to Enhanced UI
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {currentNav === 'deploy' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Deploy Contracts</h1>
                  <p className="mb-6 text-text-primary font-primary">Deploy the SafeCap smart contracts to the Sepolia testnet for testing and development.</p>
                  {useEnhancedComponents ? <EnhancedDeployContracts /> : <DeployContracts />}
                </div>
              )}
              
              {currentNav === 'donate' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Donate to Campaigns</h1>
                  <p className="mb-6 text-text-primary font-primary">Browse and support campaigns by donating ETH. Connect your wallet to get started.</p>
                  
                  <AccountInfo />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Campaign Card 1 */}
                    <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                      <h2 className="text-xl font-secondary font-bold mb-2 text-text-primary">Clean Energy Initiative</h2>
                      <div className="cyber-line w-full my-3"></div>
                      <p className="text-text-secondary mb-4 font-primary">Funding solar panel installations for underserved communities.</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-primary font-primary">Goal:</span>
                        <span className="text-secondary-light font-mono">5.0 ETH</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-text-primary font-primary">Raised:</span>
                        <span className="text-secondary-light font-mono">2.7 ETH</span>
                      </div>
                      <div className="w-full bg-primary-dark/50 rounded-full h-2.5 mb-4">
                        <div className="bg-secondary-main h-2.5 rounded-full" style={{ width: '54%' }}></div>
                      </div>
                      <div className="mt-4">
                        {useEnhancedComponents ? 
                          <EnhancedDonateCampaign campaignAddress="0x1234567890123456789012345678901234567890" /> : 
                          <DonateCampaign campaignAddress="0x1234567890123456789012345678901234567890" />
                        }
                      </div>
                    </div>
                    
                    {/* Campaign Card 2 */}
                    <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                      <h2 className="text-xl font-secondary font-bold mb-2 text-text-primary">Web3 Education Platform</h2>
                      <div className="cyber-line w-full my-3"></div>
                      <p className="text-text-secondary mb-4 font-primary">Building free educational resources for blockchain technology.</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-primary font-primary">Goal:</span>
                        <span className="text-secondary-light font-mono">3.5 ETH</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-text-primary font-primary">Raised:</span>
                        <span className="text-secondary-light font-mono">1.2 ETH</span>
                      </div>
                      <div className="w-full bg-primary-dark/50 rounded-full h-2.5 mb-4">
                        <div className="bg-secondary-main h-2.5 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                      <div className="mt-4">
                        {useEnhancedComponents ? 
                          <EnhancedDonateCampaign campaignAddress="0x9876543210987654321098765432109876543210" /> : 
                          <DonateCampaign campaignAddress="0x9876543210987654321098765432109876543210" />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentNav === 'about' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">About SafeCap</h1>
                  <p className="mb-6 text-text-primary font-primary">SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.</p>

                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8">
                    <h3 className="text-xl font-secondary font-bold mb-4 text-text-primary">Your Wallet</h3>
                    <div className="cyber-line w-full my-3"></div>
                    <AccountInfo />
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8">
                    <h3 className="text-xl font-secondary font-bold mb-4 text-text-primary">How It Works</h3>
                    <div className="cyber-line w-full my-3"></div>
                    <div className="space-y-4 text-text-primary font-primary">
                      <p><span className="text-secondary-main font-bold">1. Create a Campaign</span> - No wallet needed! We create a managed wallet for your campaign.</p>
                      <p><span className="text-secondary-main font-bold">2. Share Your Campaign</span> - Get your unique campaign link and share it with potential donors.</p>
                      <p><span className="text-secondary-main font-bold">3. Collect Donations</span> - Donors connect their wallets and contribute ETH to your campaign.</p>
                      <p><span className="text-secondary-main font-bold">4. Reach Your Goal</span> - Once your funding goal is reached, funds are released to your campaign wallet.</p>
                      <p><span className="text-secondary-main font-bold">5. Withdraw Funds</span> - Transfer funds to your personal wallet or use our integrated services.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

            <section className="content-full">
              <div className="content-full-inner">
                <h2 className='text-5xl font-secondary font-bold text-primary-contrast'>The Future of Crowd-funding is Here.</h2>

              </div>
            </section>
            <section className="content-full bg-none">
              <div className="content-full-inner">
                <ul className="mt-6 space-y-4 text-left font-primary">
                  <li className="flex items-start">
                    <span className="mr-2 text-accent-main">•</span>
                    <span className="text-primary-contrast">Raise Funds Your Way: Accept ETH & ERC20 donations.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-accent-main">•</span>
                    <span className="text-primary-contrast">Reward Support with NFTs: Automatically mint unique digital collectibles for backers.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-accent-main">•</span>
                    <span className="text-primary-contrast">Transparent & Secure: Powered by audited smart contracts on the blockchain.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-accent-main">•</span>
                    <span className="text-primary-contrast">All-or-Nothing Funding: Creator receives funds only if the goal is met.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-accent-main">•</span>
                    <span className="text-primary-contrast">On-Chain Tracking: Verifiable progress and donation history.</span>
                  </li>
                </ul>
              </div>

            </section>
        </div>
        <div className="bg-primary-main text-primary-contrast text-center py-4">
          <div className="container mx-auto">
            <p className="font-primary">&copy; 2025 SafeCap.xyz. All rights reserved.</p>
          </div>
        </div>
      </div>



    </>
  )
}

export default App