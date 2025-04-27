import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { DonateCampaign } from './components/DonateCampaign'

function App() {
  const [currentNav, setCurrentNav] = useState('home');

  const handleNavClick = (key: string) => {
    setCurrentNav(key);
  };

  return (
    <>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-primary-main h-16 text-primary-contrast flex items-center justify-between px-4 shadow-md">
          <div className="flex items-center">
            <div className="font-secondary font-bold text-2xl">SafeCap</div>
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
            <div className='content-main min-h-[900px]'>
              {currentNav === 'deploy' && (
                <div className="p-6">
                  <h2 className="text-3xl font-secondary font-bold mb-4 text-primary-dark">Deploy Contracts on Sepolia Testnet</h2>
                  <p className="mb-6 text-text-secondary font-primary">Deploy the SafeCap smart contracts to the Sepolia testnet for testing and development.</p>

                  <DeployContracts />
                </div>
              )}
              
              {currentNav === 'donate' && (
                <div className="p-6">
                  <h2 className="text-3xl font-secondary font-bold mb-4 text-primary-dark">Donate to Test Campaign</h2>
                  <p className="mb-6 text-text-secondary font-primary">Send a test donation to our sample campaign on the Sepolia testnet.</p>

                  <DonateCampaign 
                    key="donate-campaign"
                    campaignAddress="0xa191f56cdce58622f8699b45042eb743f68b874f" 
                  />
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