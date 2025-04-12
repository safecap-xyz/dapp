import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1 className="font-faustina font-bold">SafeCap.xyz</h1>
    <div className='content-main mb-[32rem]'>
      
    </div>

    <section className="content-full">
  <div className="content-full-inner">
      <h2 className='text-[46px] font-faustina font-bold'>The Future of Crowdfunding is Here.</h2>
    <p className="content-text">
      • Raise Funds Your Way: Accept ETH & ERC20 donations.<br/>
      • Reward Support with NFTs: Automatically mint unique digital collectibles for backers.<br/>
      • Transparent & Secure: Powered by audited smart contracts on the blockchain.<br/>
      • All-or-Nothing Funding: Creator receives funds only if the goal is met.<br/>
      • On-Chain Tracking: Verifiable progress and donation history.
    </p>
  </div>
</section>
    </>
  )
}

export default App
