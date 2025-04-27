import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { CampaignList } from './components/CampaignList'

function App() {
  const [currentNav, setCurrentNav] = useState('home');

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
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'deploy' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('deploy')}>
                  Deploy
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'donate' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('donate')}>
                  Donate
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'about' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('about')}>
                  About
                </li>
              </ul>
            </nav>
            <WalletConnect />
          </div>
        </div>
        <div className="min-h-[120px] text-white text-center">

          <div className="bg-main">
            <div className='content-main min-h-[900px] p-6'>
              {currentNav === 'deploy' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Deploy Contracts</h1>
                  <p className="mb-6 text-text-primary font-primary">Deploy the SafeCap smart contracts to the Sepolia testnet for testing and development.</p>
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                    <DeployContracts />
                  </div>
                </div>
              )}
              
              {currentNav === 'donate' && (
                <CampaignList />
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
                      <p><span className="text-secondary-main font-bold">1. Create a Campaign</span> - Launch your funding campaign with just a few clicks.</p>
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
                <h2 className='text-[46px] font-faustina font-bold'>The Future of Crowd-funding is Here.</h2>

              </div>
            </section>
            <section className="content-full bg-none">
              <div className="content-full-inner">
                <ul className="mt-6 space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>Raise Funds Your Way: Accept ETH & ERC20 donations.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>Reward Support with NFTs: Automatically mint unique digital collectibles for backers.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>Transparent & Secure: Powered by audited smart contracts on the blockchain.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>All-or-Nothing Funding: Creator receives funds only if the goal is met.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-400">•</span>
                    <span>On-Chain Tracking: Verifiable progress and donation history.</span>
                  </li>
                </ul>
              </div>

            </section>
        </div>
        <div className="bg-[#001862] text-white text-center py-4">
          <div className="container mx-auto">
            <p>&copy; 2025 SafeCap.xyz. All rights reserved.</p>
          </div>
        </div>
      </div>



    </>
  )
}

export default App