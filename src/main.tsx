import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WagmiProvider } from './web3/WagmiProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider>
      <App />
    </WagmiProvider>
  </StrictMode>,
)
