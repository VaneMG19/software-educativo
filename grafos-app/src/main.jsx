import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'


// este main arranca React y apuntan al HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)