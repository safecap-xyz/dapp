import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { EnhancedWalletConnect } from './components/EnhancedWalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { EnhancedDeployContracts } from './components/EnhancedDeployContracts'
import { DonateCampaign } from './components/DonateCampaign'
import { EnhancedDonateCampaign } from './components/EnhancedDonateCampaign'

function App() {
  const [currentNav, setCurrentNav] = useState('home')
  // State to toggle between original and enhanced components
  const [useEnhancedComponents, setUseEnhancedComponents] = useState(true);;

  return (
    <>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-primary-main h-16 text-white flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="font-secondary font-bold text-2xl glow-text">SafeCap</div>
            <div className="ml-2 text-sm bg-accent-main text-accent-contrast px-2 py-0.5 rounded-full font-medium">Sepolia Testnet</div>
          </div>
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
        <div className="min-h-[120px] text-white text-center">

          <div className="bg-main">
            <div className='content-main min-h-[900px]'>
              {currentNav === 'deploy' && (
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-4 font-secondary glow-text">Deploy Contracts</h1>
                  {useEnhancedComponents ? <EnhancedDeployContracts /> : <DeployContracts />}
                </div>
              )}
              
              {currentNav === 'donate' && (
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-4 font-secondary glow-text">Donate to Campaign</h1>
                  <AccountInfo />
                  {useEnhancedComponents ? 
                    <EnhancedDonateCampaign campaignAddress="0x1234567890123456789012345678901234567890" /> : 
                    <DonateCampaign campaignAddress="0x1234567890123456789012345678901234567890" />
                  }
                </div>
              )}

              {currentNav === 'about' && (
                <div className="p-6">
                  <h2 className="text-3xl font-secondary font-bold mb-4 text-primary-dark">About SafeCap</h2>
                  <p className="mb-6 text-text-secondary font-primary">SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.</p>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">Your Wallet</h3>
                    <AccountInfo />
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