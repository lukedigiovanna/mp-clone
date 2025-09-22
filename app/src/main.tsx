import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { Resources } from './game/resources.ts'

console.log('resources loading')
await Resources.loadAll();
console.log('resources done')

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
