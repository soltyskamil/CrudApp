import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './styles/index/index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { initialState, reducer } from './reducer/reducer.jsx'
import { StateProvider } from './reducer/StateProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
        <App />
      </Router>
    </StateProvider>
  </React.StrictMode>,
)
