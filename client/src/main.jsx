import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { StateContextProvider } from './context/index.jsx'
import { ThirdwebProvider } from '@thirdweb-dev/react'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ThirdwebProvider >
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </ThirdwebProvider>
    </StrictMode>
  </BrowserRouter>

)
