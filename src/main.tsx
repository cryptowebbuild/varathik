import { render } from 'preact'
import './index.css'
import App from './App.tsx'

render(<App />, document.getElementById('root')!)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {})
  })
}
