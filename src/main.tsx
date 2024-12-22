import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from 'src/app.component.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
