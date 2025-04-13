import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { DonateCampaign } from './components/DonateCampaign'
import { useWallet } from './web3/hooks/useWallet'

function App() {
  const [currentNav, setCurrentNav] = useState('home');

  const handleNavClick = (key: string) => {
    setCurrentNav(key);
  };

  return (
    <>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#001862] h-16 text-white flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="font-bold text-xl">SafeCap</div>
            <div className="ml-2 text-sm bg-yellow-600 text-white px-2 py-0.5 rounded-full">Sepolia Testnet</div>
          </div>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li className={`cursor-pointer ${currentNav === 'home' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('home')}>
                  Home
                </li>
                <li className={`cursor-pointer ${currentNav === 'deploy' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('deploy')}>
                  Deploy
                </li>
                <li className={`cursor-pointer ${currentNav === 'donate' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('donate')}>
                  Donate
                </li>
                <li className={`cursor-pointer ${currentNav === 'about' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('about')}>
                  About
                </li>
              </ul>
            </nav>
            <WalletConnect />
          </div>
        </div>
        <div className="min-h-[120px] text-white text-center leading-[120px]">

          <div className="bg-main">
            <div className='content-main min-h-[900px]'>
              {currentNav === 'deploy' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Deploy Contracts on Sepolia Testnet</h2>
                  <p className="mb-6">Deploy the SafeCap smart contracts to the Sepolia testnet for testing and development.</p>

                  <DeployContracts />
                </div>
              )}
              
              {currentNav === 'donate' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Donate to Test Campaign</h2>
                  <p className="mb-6">Send a test donation to our sample campaign on the Sepolia testnet.</p>

                  <DonateCampaign 
                    key="donate-campaign"
                    campaignAddress="0xa191f56cdce58622f8699b45042eb743f68b874f" 
                  />
                </div>
              )}

              {currentNav === 'about' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About SafeCap</h2>
                  <p className="mb-6">SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.</p>

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