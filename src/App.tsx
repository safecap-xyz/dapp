import './App.css'
import { useState } from 'react'
import { WalletConnect } from './components/WalletConnect'
import { AccountInfo } from './components/AccountInfo'
import { DeployContracts } from './components/DeployContracts'
import { SmartAccountDeployer } from './components/SmartAccountDeployer'
import { SmartAccountTester } from './components/SmartAccountTester'
import { CampaignList } from './components/CampaignList'
import { ThemeProvider } from './theme/ThemeProvider'
import { Typography } from './components/ui'
import TestContractDeployment from './components/TestContractDeployment'
// Import DeployManagedCampaign as default export
import DeployManagedCampaign from './components/DeployManagedCampaign'

function App() {
  const [currentNav, setCurrentNav] = useState('home');

  const handleNavClick = (key: string) => {
    setCurrentNav(key);
  };

  return (
    <ThemeProvider>
      {/* Layout 1: Header-Content-Footer */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-primary-main h-16 text-white flex items-center justify-between px-4 shadow-neon">
          <div className="flex items-center">
            <div className="font-secondary font-bold text-2xl glow-text">SafeCap</div>
            {/* <div className="ml-2 text-sm bg-accent-main text-accent-contrast px-2 py-0.5 rounded-full font-medium">Base Sepolia Testnet</div> */}
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
                  Deploy EOA
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'deployT' ? 'border-b-2 border-accent-main' : ''}`}
                  onClick={() => handleNavClick('deployT')}>
                  Deploy Managed
                </li>
                {/* <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'smartAccount' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('smartAccount')}>
                  Smart Account
                </li>
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'tester' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('tester')}>
                  SmartOp Tester
                </li> */}
                <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'donate' ? 'border-b-2 border-accent-main' : ''}`}
                  onClick={() => handleNavClick('donate')}>
                  Donate
                </li>
                {/* <li className={`cursor-pointer transition-colors hover:text-accent-main ${currentNav === 'testDeploy' ? 'border-b-2 border-accent-main' : ''}`}
                    onClick={() => handleNavClick('testDeploy')}>
                  Test Deploy
                </li> */}
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
              {currentNav === 'home' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Welcome to SafeCap</h1>
                  {/* <p className="mb-6 text-text-primary font-primary">The future of decentralized crowdfunding is here. Launch your campaign with transparency and security.</p> */}
                  {/* <Typography variant="h1" className="mb-6 glow-text">Welcome to SafeCap</Typography>
                  <Typography variant="body1" className="mb-8">The future of decentralized crowdfunding is here. Launch your campaign with transparency and security.</Typography> */}

                  {/* <div className="flex gap-4 justify-center mt-8">
                    <Button
                      variant="secondary"
                      size="large"
                      onClick={() => handleNavClick('deploy')}
                    >
                      Launch Campaign
                    </Button>
                    <Button
                      variant="outline"
                      size="large"
                      onClick={() => handleNavClick('donate')}
                    >
                      Explore Campaigns
                    </Button>
                  </div> */}
                </div>
              )}

              {currentNav === 'deploy' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Deploy Contracts</h1>
                  <p className="mb-6 text-text-primary font-primary">Deploy the SafeCap smart contracts to the Base Sepolia testnet for testing and development.</p>
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                    <DeployContracts />
                  </div>
                </div>
              )}

              {currentNav === 'deployT' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Deploy Managed Campaign</h1>
                  <p className="mb-6 text-text-primary font-primary">Deploy a managed campaign using account abstraction and smart accounts.</p>
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                    <DeployManagedCampaign />
                  </div>
                </div>
              )}

              {currentNav === 'smartAccount' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Smart Account Deployment</h1>
                  <p className="mb-6 text-text-primary font-primary">Deploy campaigns using a smart account with UserOp for gasless transactions.</p>
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                    <SmartAccountDeployer />
                  </div>
                </div>
              )}

              {currentNav === 'tester' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Smart Account Operation Tester</h1>
                  <p className="mb-6 text-text-primary font-primary">Test smart account operations with simple UserOp transactions.</p>
                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
                    <SmartAccountTester />
                  </div>
                </div>
              )}

              {currentNav === 'donate' && (
                <CampaignList />
              )}

              {currentNav === 'story' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">About SafeCap</h1>
                  <p className="mb-6 text-text-primary font-primary">SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.</p>

                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8 max-w-[560px] mx-auto">
                    <Typography variant="h3" className="mb-4">SafeCap: Crowdfunding Without Permission</Typography>
                    <div className="cyber-line w-full my-3"></div>
                    <div className="prose max-w-none">
                      <p className="italic text-sm">By Wayne Vest</p>

                      <p>One of the most interesting things about the internet is how it keeps finding ways to remove gatekeepers. The web let anyone publish. Open source let anyone build. Crypto, at its best, lets anyone transact. But there's one area that's still surprisingly centralized: crowdfunding.</p>

                      <p>If you want to raise money for a project, you have to go through a platform—Kickstarter, GoFundMe, Indiegogo. They decide who gets to raise money, how, and for what. They take a cut. They can shut you down. In a world where anyone can spin up a DAO or launch a token, this feels oddly retro.</p>

                      <p>That's why SafeCap is interesting. SafeCap is a decentralized crowdfunding platform built on Base. But "decentralized crowdfunding" is one of those phrases that sounds like marketing until you look closer. What does it actually mean?</p>

                      <h4 className="text-secondary-main font-bold mt-6 mb-2">Permissionless Crowdfunding</h4>

                      <p>On SafeCap, anyone can create a crowdfunding campaign. There's no approval process, no gatekeeper. You deploy a smart contract, set your parameters—how long the campaign runs, what the goal is—and you're live. Anyone, anywhere, can donate. No one can stop you, and no one can take a cut.</p>

                      <p>This is the kind of thing that sounds trivial until you realize how rare it is. Most crowdfunding platforms are, at their core, just fancy databases with payment processors attached. SafeCap is a protocol. It's a set of rules, enforced by code, that anyone can use.</p>

                      <h4 className="text-secondary-main font-bold mt-6 mb-2">CDP Wallets: Crowdfunding Without the Friction</h4>

                      <p>SafeCap integrates CDP (Coinbase Developer Platform) wallets. These wallets are spun up inside a Trusted Execution Environment (TEE), which means they're both secure and easy to use. The real breakthrough here is in user experience: without CDP wallets, launching a crowdfunding campaign on-chain usually means signing a flurry of transactions, each one a potential stumbling block for non-crypto-natives.</p>

                      <p>With CDP wallets, all that friction disappears. Starting a fundraising campaign becomes a one-click process. You don't have to worry about managing private keys or confirming every step. The TEE keeps your wallet secure, and the platform handles the complexity behind the scenes. This is the kind of invisible infrastructure that makes decentralized systems actually usable—removing the pain points so anyone can participate, not just the technically adventurous.</p>

                      <h4 className="text-secondary-main font-bold mt-6 mb-2">NFTs as Proof of Donation</h4>

                      <p>When you donate to a campaign, you get an NFT. But not just any NFT. SafeCap uses AI to generate an image that's unique to the campaign. It's a kind of digital badge—a proof that you supported something at a particular moment in time.</p>

                      <p>This is more than just a gimmick. NFTs are receipts, but they're also social objects. They let you show off what you've supported. They can be traded, displayed, or used as credentials. In a world where reputation is increasingly digital, this matters.</p>

                      <h4 className="text-secondary-main font-bold mt-6 mb-2">AI Agents as Fundraisers</h4>

                      <p>Here's where it gets weird—in a good way. When you create a campaign, you can deploy an AI agent (using AgentKit) to help find donors. The agent can reach out, make the pitch, and even accept donations directly. When someone donates through the agent, they get an NFT, just like if they donated directly.</p>

                      <p>This is the kind of thing that feels like science fiction until you realize it's just software. Fundraising has always been about finding the right people and making the right pitch. Now you can automate that. You can have an army of agents, each working to find donors for your cause.</p>

                      <h4 className="text-secondary-main font-bold mt-6 mb-2">What's Next?</h4>

                      <p>SafeCap is still early. There are a million things that could go wrong. But the idea is powerful: crowdfunding without permission, enforced by code, with AI agents doing the legwork. It's the kind of thing that, if it works, will seem obvious in retrospect.</p>

                      <p>The internet keeps removing gatekeepers. SafeCap is another step in that direction. If you want to raise money for something, you shouldn't need anyone's permission. Now, maybe, you don't.</p>
                    </div>
                  </div>

                </div>
              )}

              {currentNav === 'about' && (
                <div>
                  <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">About SafeCap</h1>
                  <p className="mb-6 text-text-primary font-primary">SafeCap is a decentralized crowdfunding platform built on blockchain technology that enables transparent, secure, and efficient fundraising for projects.</p>


                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8">
                    <Typography variant="h3" className="mb-4">Your Wallet</Typography>
                    <div className="cyber-line w-full my-3"></div>
                    <AccountInfo />
                  </div>



                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8">
          <section className="content-full">
            <div className="content-full-inner">
              <Typography variant="h2" className="text-[46px] font-bold">The Future of Crowd-funding is Here.</Typography>
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


                  <div className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30 mb-8">
                    <Typography variant="h3" className="mb-4">How It Works</Typography>
                    <div className="cyber-line w-full my-3"></div>
                    <div className="space-y-4">
                      <p><span className="text-secondary-main font-bold">1. Create a Campaign</span> - Launch your funding campaign with just a few clicks.</p>
                      <p><span className="text-secondary-main font-bold">2. Share Your Campaign</span> - Get your unique campaign link and share it with potential donors.</p>
                      <p><span className="text-secondary-main font-bold">3. Collect Donations</span> - Donors connect their wallets and contribute ETH to your campaign.</p>
                      <p><span className="text-secondary-main font-bold">4. Reach Your Goal</span> - Once your funding goal is reached, funds are released to your campaign wallet.</p>
                      <p><span className="text-secondary-main font-bold">5. Withdraw Funds</span> - Transfer funds to your personal wallet or use our integrated services.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentNav === 'testDeploy' && (
                <div>
                  <Typography variant="h1" className="mb-6 glow-text">Contract Deployment Tester</Typography>
                  <Typography variant="body1" className="mb-6">
                    This tool allows you to test contract deployments with detailed logging to help diagnose issues.
                  </Typography>
                  <TestContractDeployment />
                </div>
              )}

              {/* {currentNav === 'showcase' && (
                <div>
                  <Typography variant="h1" className="mb-6 glow-text">UI Component Showcase</Typography>
                  <Typography variant="body1" className="mb-6">
                    This page demonstrates the various UI components and styles available in the SafeCap platform.
                    These components have been imported from the new branch with enhanced styling.
                  </Typography>
                  <Showcase />
                </div>
              )} */}
            </div>

          </div>

        </div>
        <div className="bg-primary-dark text-white text-center py-4">
          <div className="container mx-auto">
            <p>&copy; 2025 SafeCap.xyz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
