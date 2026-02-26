import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// Set absolute base URL for API calls in production
// If VITE_API_URL is not set (development), use empty string (proxied by Vite)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Add interceptor to handle absolute URLs for uploads if needed
axios.interceptors.request.use(config => {
  // If we're calling /uploads/..., use the base URL if set
  if (config.url.startsWith('/uploads/')) {
    config.url = `${axios.defaults.baseURL}${config.url}`;
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
