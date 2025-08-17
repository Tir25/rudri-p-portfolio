import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 Starting Rudri Dave Portfolio...')

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  const root = createRoot(rootElement)
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  
  console.log('✅ App rendered successfully')
} catch (error) {
  console.error('❌ Error starting app:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Error Loading Portfolio</h1>
      <p>There was an error loading the application. Please try refreshing the page.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `
}
