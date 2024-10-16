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
      <ThirdwebProvider desiredChainId={"WezQWIiwvleMQ7Y_nMrrRkvcknu8dOtLYrq8AeI9zsqeAmcQDXazJ17POecRqj1mQSQLKK2bdTUsN47YVNw5BQ"}>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </ThirdwebProvider>
    </StrictMode>
  </BrowserRouter>

)
