// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';


createRoot(document.getElementById('root')).render(
<Auth0Provider
    domain="harshauth.us.auth0.com"
    clientId="g85L8eLv37VeQcjO6QLvhyX2WH4UWru0"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
  
)
