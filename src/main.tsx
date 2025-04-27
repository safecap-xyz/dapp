import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import './theme/global.css'
import App from './App.tsx'
import { WagmiProvider } from './web3/WagmiProvider'
import { ThemeProvider } from './theme/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WagmiProvider>
  </StrictMode>,
)
