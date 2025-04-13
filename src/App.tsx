import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { useWallet } from './web3/hooks/useWallet'

function App() {
  const [currentNav, setCurrentNav] = useState('home');
  const { isConnected, displayName } = useWallet();

  const handleNavClick = (key: string) => {
    setCurrentNav(key);
  };

  return (
    <>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#001862] h-16 text-white flex items-center justify-between px-4">
          <div className="font-bold text-xl">SafeCap</div>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li className={`cursor-pointer ${currentNav === 'home' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('home')}>
                  Home
                </li>
                <li className={`cursor-pointer ${currentNav === 'projects' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('projects')}>
                  Projects
                </li>
                <li className={`cursor-pointer ${currentNav === 'about' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleNavClick('about')}>
                  About
                </li>
                <li>
                  <a href="https://docs.safecap.xyz" target="_blank" rel="noopener noreferrer"
                     className="hover:underline">
                    Documentation
                  </a>
                </li>
              </ul>
            </nav>
            <WalletConnect />
          </div>
        </div>
        <div className="bg-blue-700 min-h-[120px] text-white text-center leading-[120px]">

          <div className="bg-main">
            <div className='content-main min-h-[900px]'>
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
        <div className="bg-blue-500 text-white text-center py-4">Footer</div>
      </div>



    </>
  )
}

export default App